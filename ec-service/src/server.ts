import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getUser } from './utils/auth';

// Load environment variables
dotenv.config();

// Create Prisma client
const prisma = new PrismaClient();

// Read schema file
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'graphql/typeDefs/schema.graphql'),
  'utf8'
);

// Create minimal resolvers for startup
const resolvers = {
  Query: {
    // Simple health check
    healthCheck: () => 'OK',
  },
};

async function startServer() {
  // Create Express application
  const app = express();
  
  // Configure Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: any) => {
      // Get authenticated user from token
      const user = await getUser(req);
      
      return {
        user,
        prisma,
      };
    },
  });
  
  await server.start();
  
  // Apply middleware - use any to avoid type issues
  server.applyMiddleware({ app: app as any });
  
  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Handle server startup errors
startServer().catch((error) => {
  console.error('Error starting server:', error);
});