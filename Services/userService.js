import UserModel from "../Models/UserModel.js";
import UserDto from "../dtos/userDto.js";
import { v4 } from "uuid";
import ApiError from "../exceptions/ApiError.js";
import tokenService from "./tokenService.js";
import sendMail from "./mailService.js";
import bcrypt from "bcryptjs";
import config from "../config.js";
import TokenModel from "../Models/TokenModel.js";

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with such email ${email} already exists`);
    }
    const activationLink = v4();
    const hashPassword = await bcrypt.hash(password, 7);
    const user = await UserModel.create({
      email,
      password: hashPassword,
      roles: ["ADMIN", "USER"],
      activationLink,
    });

    await sendMail(email, `${process.env.HOST_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with such email ${email} not found`);
    }
    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest("Entered wrong password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const tokenData = await tokenService.deleteToken(refreshToken);
    return tokenData;
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Uncorrect link');
    }
    user.isActivated = true;
    return user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenService) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

export default new UserService();
