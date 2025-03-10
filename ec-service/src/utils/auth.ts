import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Simple hashing for development only
export const hashPassword = async (password: string): Promise<string> => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Simple password comparison for development only
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const hashed = crypto.createHash('sha256').update(password).digest('hex');
  return hashed === hashedPassword;
};

// Creating JWT token
export const createToken = (user: User): string => {
  const { id, email, role } = user;
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
};

// Verifying JWT token and returning user
export const getUserFromToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as { id: string };
    
    return prisma.user.findUnique({
      where: { id: decoded.id },
    });
  } catch (error) {
    return null;
  }
};

// Context function for Apollo Server
export const getUser = async (req: any): Promise<User | null> => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  return getUserFromToken(token);
};