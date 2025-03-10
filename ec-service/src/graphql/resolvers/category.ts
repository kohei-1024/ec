import { PrismaClient } from '@prisma/client';
import { ApolloError, ForbiddenError } from 'apollo-server-express';

interface Context {
  prisma: PrismaClient;
  user: any;
}

export const categoryResolvers = {
  Query: {
    categories: async (_: any, __: any, { prisma }: Context) => {
      return prisma.category.findMany();
    },
    
    category: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      const category = await prisma.category.findUnique({
        where: { id },
      });
      
      if (!category) {
        throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
      }
      
      return category;
    },
  },
  
  Mutation: {
    createCategory: async (
      _: any,
      { input }: { input: { name: string; description?: string; parentId?: string } },
      { user, prisma }: Context
    ) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      // Check if category with the same name already exists
      const existingCategory = await prisma.category.findUnique({
        where: { name: input.name },
      });
      
      if (existingCategory) {
        throw new ApolloError('Category name already exists', 'CATEGORY_NAME_EXISTS');
      }
      
      // Check if parent category exists if specified
      if (input.parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: input.parentId },
        });
        
        if (!parentCategory) {
          throw new ApolloError('Parent category not found', 'PARENT_CATEGORY_NOT_FOUND');
        }
      }
      
      return prisma.category.create({
        data: {
          name: input.name,
          description: input.description,
          parentId: input.parentId,
        },
      });
    },
    
    updateCategory: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; description?: string; parentId?: string } },
      { user, prisma }: Context
    ) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id },
      });
      
      if (!category) {
        throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
      }
      
      // Check if category name already exists if changing name
      if (input.name && input.name !== category.name) {
        const existingCategory = await prisma.category.findUnique({
          where: { name: input.name },
        });
        
        if (existingCategory) {
          throw new ApolloError('Category name already exists', 'CATEGORY_NAME_EXISTS');
        }
      }
      
      // Check if parent category exists if specified
      if (input.parentId && input.parentId !== category.parentId) {
        // Prevent circular references
        if (input.parentId === id) {
          throw new ApolloError('Category cannot be its own parent', 'INVALID_PARENT');
        }
        
        const parentCategory = await prisma.category.findUnique({
          where: { id: input.parentId },
        });
        
        if (!parentCategory) {
          throw new ApolloError('Parent category not found', 'PARENT_CATEGORY_NOT_FOUND');
        }
      }
      
      return prisma.category.update({
        where: { id },
        data: {
          name: input.name,
          description: input.description,
          parentId: input.parentId,
        },
      });
    },
    
    deleteCategory: async (_: any, { id }: { id: string }, { user, prisma }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized');
      }
      
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id },
      });
      
      if (!category) {
        throw new ApolloError('Category not found', 'CATEGORY_NOT_FOUND');
      }
      
      // Check if category has products
      const productsCount = await prisma.product.count({
        where: { categoryId: id },
      });
      
      if (productsCount > 0) {
        throw new ApolloError('Category has products and cannot be deleted', 'CATEGORY_HAS_PRODUCTS');
      }
      
      // Check if category has child categories
      const childrenCount = await prisma.category.count({
        where: { parentId: id },
      });
      
      if (childrenCount > 0) {
        throw new ApolloError('Category has child categories and cannot be deleted', 'CATEGORY_HAS_CHILDREN');
      }
      
      await prisma.category.delete({
        where: { id },
      });
      
      return true;
    },
  },
  
  Category: {
    parent: async (parent: any, _: any, { prisma }: Context) => {
      if (!parent.parentId) {
        return null;
      }
      
      return prisma.category.findUnique({
        where: { id: parent.parentId },
      });
    },
    
    children: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.category.findMany({
        where: { parentId: parent.id },
      });
    },
    
    products: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.product.findMany({
        where: { categoryId: parent.id },
      });
    },
  },
};