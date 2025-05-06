function authorizeRole(role) {
    return (req, res, next) => {
      const userRole = req.header("x-role");
      if (userRole !== role) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    };
  }
  
module.exports = { authorizeRole };
  