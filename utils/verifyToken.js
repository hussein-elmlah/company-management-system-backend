import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' });
const { JWT_SECRET } = process.env;


export const verifyToken = (req, res, next) => {

  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    req.body._id = decoded._id;
    next();
  } catch (error) {
    // next(error);
    res.status(401).json({ error: "Invalid token" });
  }

}


