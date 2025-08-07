const requireRegisterSession = (req, res, next) => {
  console.log(1);
  console.log(req.session.userEmail);
    if (!req.session.userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    next();
  };
  
  module.exports = requireRegisterSession;
  