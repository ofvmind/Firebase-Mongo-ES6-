import ApiError from "../exceptions/ApiError.js";

export default function errorMiddleware(err, req, res, next) {
  console.log(err);

  if (err instanceof ApiError) {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Unexprected token" });
};