const { authClient } = require("../services/supabase");
const { getProfileById } = require("../services/profileService");

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: missing bearer token." });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: invalid or expired token." });
    }

    const profile = await getProfileById(data.user.id);

    req.token = token;
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: profile.role
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  verifyToken
};
