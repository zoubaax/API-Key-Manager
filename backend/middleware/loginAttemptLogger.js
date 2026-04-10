function logLoginAttempt(req, res, next) {
  const email = req.body?.email || "unknown";
  const sourceIp = req.ip;
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `[AUTH] login attempt email=${email} ip=${sourceIp} status=${res.statusCode} durationMs=${durationMs}`
    );
  });

  next();
}

module.exports = {
  logLoginAttempt
};
