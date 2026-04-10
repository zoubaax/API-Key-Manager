function getDashboard(req, res) {
  return res.status(200).json({
    message: "Dashboard data loaded successfully.",
    user: req.user
  });
}

function getAdminPanel(req, res) {
  return res.status(200).json({
    message: "Welcome to the admin area.",
    user: req.user
  });
}

module.exports = {
  getDashboard,
  getAdminPanel
};
