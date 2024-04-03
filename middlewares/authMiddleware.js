import ApiError from "../exceptions/ApiError.js";
import tokenService from "../Services/tokenService.js";

export const authMiddleware = user_roles => (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    if (!userData.isActivated) {
      return next(ApiError.BadRequest('Activate your account first'));
    }
    let hasRights = false;
    userData.roles.forEach(role => {
      if (user_roles.includes(role)) hasRights = true;
    });
    if (!hasRights) {
      return next(ApiError.BadRequest('User has not rights'));
    }
    req.user = userData;
    next();
  } catch (e) {
    return res.status(500).json({ message: "Error in auth-middleware", error: e.message });
  }
};