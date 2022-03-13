import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export  const verify_user  = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.json({
        success:false,
        message:"Please provide correct Authorization token"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    let email = decoded.email;

    const user = await User.findOne({email});

    if (!user) {
        res.json({
            succes:false,
            message:"User  not found"
        }).status(404)
        return
    }
    req.user = user;
    next();
  } catch (err) {
      res.json({
          success:false,
          message:'Not authorized to access this router'
      }).status(401)
      return;
    
  }
};
