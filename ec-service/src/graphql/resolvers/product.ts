import { PrismaClient } from '@prisma/client';
import { ApolloError, ForbiddenError } from 'apollo-server-express';

interface Context {
  prisma: PrismaClient;
  user: any;
}

export const productResolvers = {
  Query: {
    // Get all products with filtering, sorting, and pagination
    products: async (
      _: any,
      {
        search,
        categoryId,
        sortBy = 'createdAt',
        sortDirection = 'desc',
        limit = 10,
        offset = 0,
      }: {
        search?: string;
        categoryId?: string;
        sortBy?: string;
        sortDirection?: string;
        limit?: number;
        offset?: number;
      },
      { prisma }: Context
    ) => {
      // Build the where clause
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ];
      }
      
      if (categoryId) {
        where.categoryId = categoryId;
      }
      
      // Get the total count
      const totalCount = await prisma.product.count({ where });
      
      // Get the products
      const products = await prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortDirection.toLowerCase() },
        take: limit,
        skip: offset,
      });
      
      return {
        edges: products,
        totalCount,
      };
    },
    
    // Get product by ID
    product: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new ApolloError('Product not found', 'PRODUCT_NOT_FOUND');
      }
      
      return product;
    },
  },
  
  Mutation: {
    // Create a new product (admin only)
    createProduct: async (
      _: any,
      {
        input,
      }: {
        input: {
          name: string;
          description: string;
          price: number;
          stock: number;
          images: string[];
          categoryId: string;
        };
      },
      { user, prisma }: Context
    ) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      
      if (!category) {
        throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
      }
      
      return prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          stock: input.stock,
          images: JSON.stringify(input.images),
          categoryId: input.categoryId,
        },
      });
    },
    
    // Update product (admin only)
    updateProduct: async (
      _: any,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name?: string;
          description?: string;
          price?: number;
          stock?: number;
          images?: string[];
          categoryId?: string;
        };
      },
      { user, prisma }: Context
    ) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new ApolloError('Product not found', 'PRODUCT_NOT_FOUND');
      }
      
      // Check if category exists if specified
      if (input.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: input.categoryId },
        });
        
        if (!category) {
          throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
        }
      }
      
      // Prepare update data
      const updateData: any = {};
      
      if (input.name) updateData.name = input.name;
      if (input.description) updateData.description = input.description;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.stock !== undefined) updateData.stock = input.stock;
      if (input.images) updateData.images = JSON.stringify(input.images);
      if (input.categoryId) updateData.categoryId = input.categoryId;
      
      return prisma.product.update({
        where: { id },
        data: updateData,
      });
    },
    
    // Delete product (admin only)
    deleteProduct: async (_: any, { id }: { id: string }, { user, prisma }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new ApolloError('Product not found', 'PRODUCT_NOT_FOUND');
      }
      
      await prisma.product.delete({
        where: { id },
      });
      
      return true;
    },
  },
  
  Product: {
    // Resolve product's category
    category: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.category.findUnique({
        where: { id: parent.categoryId },
      });
    },
    
    // Parse JSON images
    images: (parent: any) => {
      try {
        return JSON.parse(parent.images);
      } catch (error) {
        return [];
      }
    },
  },
};