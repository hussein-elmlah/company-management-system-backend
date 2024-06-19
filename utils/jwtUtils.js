import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' });

const { JWT_SECRET } = process.env;

export const generateTokenUser = (user) => {
  try {
    if (!user || !user.username || !user._id || !user.role) {
      return new Error('Invalid user object.');
    }

    if (!JWT_SECRET) {
      return new Error('JWT secret is not defined.');
    }
    
    const token = jsonwebtoken.sign(
      { username: user.username, id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error.message);
    throw error;
  }
};
