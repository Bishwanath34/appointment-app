const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Auth failed", success: false });
    }

    const token = authHeader.split(" ")[1];
    

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      
      // Attach user ID here, not to req.body
      req.userId = decoded.id;

      next();
    } catch (verifyErr) {
      
      return res.status(401).send({ message: "Auth failed", success: false });
    }

  } catch (err) {
    
    return res.status(401).send({ message: "Auth failed", success: false });
  }
};
