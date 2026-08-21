exports.adminDashboardController = async (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
};

exports.getProfile = async (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user
  });
};
