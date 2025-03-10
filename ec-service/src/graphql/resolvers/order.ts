import { PrismaClient } from '@prisma/client';
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express';

interface Context {
  prisma: PrismaClient;
  user: any;
}

export const orderResolvers = {
  Query: {
    orders: async (_: any, __: any, { user, prisma }: Context) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Admin can see all orders, users can only see their own
      if (user.role === 'ADMIN') {
        return prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
        });
      }
      
      return prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    order: async (_: any, { id }: { id: string }, { user, prisma }: Context) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const order = await prisma.order.findUnique({
        where: { id },
      });
      
      if (!order) {
        throw new ApolloError('Order not found', 'ORDER_NOT_FOUND');
      }
      
      // Only admin or the order owner can see the order
      if (user.role !== 'ADMIN' && order.userId !== user.id) {
        throw new ForbiddenError('Not authorized');
      }
      
      return order;
    },
  },
  
  Mutation: {
    // Implement order mutations
    createOrder: async () => ({}),
    updateOrderStatus: async () => ({}),
  },
  
  Order: {
    user: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    
    items: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.orderItem.findMany({
        where: { orderId: parent.id },
      });
    },
  },
  
  OrderItem: {
    product: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.product.findUnique({
        where: { id: parent.productId },
      });
    },
  },
};