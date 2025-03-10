import { PrismaClient } from '@prisma/client';
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { comparePassword, createToken, hashPassword } from '../../utils/auth';

interface Context {
  prisma: PrismaClient;
  user: any;
}

export const userResolvers = {
  Query: {
    // Get current authenticated user
    me: async (_: any, __: any, { user, prisma }: Context) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return user;
    },
    
    // Get all users (admin only)
    users: async (_: any, __: any, { user, prisma }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      return prisma.user.findMany();
    },
    
    // Get user by ID (admin only)
    user: async (_: any, { id }: { id: string }, { user, prisma }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      const foundUser = await prisma.user.findUnique({
        where: { id },
      });
      
      if (!foundUser) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND');
      }
      
      return foundUser;
    },
  },
  
  Mutation: {
    // Register a new user
    register: async (
      _: any,
      { input }: { input: { email: string; password: string; firstName: string; lastName: string } },
      { prisma }: Context
    ) => {
      const { email, password, firstName, lastName } = input;
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        throw new ApolloError('Email already in use', 'EMAIL_IN_USE');
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });
      
      // Create cart for user
      await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
      
      // Create wishlist for user
      await prisma.wishlist.create({
        data: {
          userId: user.id,
        },
      });
      
      // Generate token
      const token = createToken(user);
      
      return {
        token,
        user,
      };
    },
    
    // Login user
    login: async (
      _: any,
      { input }: { input: { email: string; password: string } },
      { prisma }: Context
    ) => {
      const { email, password } = input;
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      // Verify password
      const validPassword = await comparePassword(password, user.password);
      
      if (!validPassword) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      // Generate token
      const token = createToken(user);
      
      return {
        token,
        user,
      };
    },
    
    // Update user
    updateUser: async (
      _: any,
      { input }: { input: { firstName?: string; lastName?: string; email?: string; password?: string } },
      { user, prisma }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const { firstName, lastName, email, password } = input;
      
      // Prepare update data
      const updateData: any = {};
      
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      
      if (email && email !== user.email) {
        // Check if email already in use
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        if (existingUser) {
          throw new ApolloError('Email already in use', 'EMAIL_IN_USE');
        }
        
        updateData.email = email;
      }
      
      if (password) {
        updateData.password = await hashPassword(password);
      }
      
      // Update user
      return prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    },
    
    // Delete user (admin only)
    deleteUser: async (_: any, { id }: { id: string }, { user, prisma }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      await prisma.user.delete({
        where: { id },
      });
      
      return true;
    },
  },
  
  User: {
    // Resolve user's orders
    orders: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.order.findMany({
        where: { userId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    // Resolve user's cart
    cart: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.cart.findUnique({
        where: { userId: parent.id },
      });
    },
    
    // Resolve user's wishlist
    wishlist: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.wishlist.findUnique({
        where: { userId: parent.id },
      });
    },
  },
};