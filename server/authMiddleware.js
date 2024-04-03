const firebase = require('./firebase_admin/firebase');

const authMiddleware = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.send('No token provided').status(401);
  }
  if (headerToken && headerToken.split(' ')[0] !== "Bearer") {
    res.send('Invalid token').status(401);
  }
  const token = headerToken.split(" ")[1];
  firebase
  .auth()
  .verifyIdToken(token)
  .then(() => next())
  .catch(() => res.send({ message: "Could not authorize" }).status(403));
};

module.exports = authMiddleware;