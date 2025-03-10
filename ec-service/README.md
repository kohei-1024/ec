# E-Commerce Backend Service

This is the backend service for an e-commerce application built with Node.js, TypeScript, GraphQL, and Prisma.

## Features

- GraphQL API with Apollo Server
- MySQL database with Prisma ORM
- User authentication with JWT
- Product catalog management
- Shopping cart functionality
- Order processing
- Wishlist management
- Role-based access control

## Tech Stack

- Node.js
- TypeScript
- Apollo Server
- Express
- Prisma
- MySQL
- GraphQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env` file:

```
DATABASE_URL="mysql://username:password@localhost:3306/ec_db"
JWT_SECRET="your-secret-key-here"
PORT=4000
```

4. Run Prisma migrations:

```bash
npm run prisma:migrate
```

5. Generate Prisma client:

```bash
npm run prisma:generate
```

### Development

Run the development server:

```bash
npm run dev
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

### Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Database Schema

The application uses the following data models:

- User (authentication and profile)
- Product (product catalog)
- Category (product categorization)
- Cart (shopping cart)
- CartItem (items in cart)
- Order (customer orders)
- OrderItem (items in orders)
- Wishlist (user wishlists)
- WishlistItem (items in wishlist)

## API Documentation

The GraphQL API provides the following main operations:

### Queries

- User: `me`, `users`, `user`
- Product: `products`, `product`
- Category: `categories`, `category`
- Cart: `cart`
- Order: `orders`, `order`
- Wishlist: `wishlist`

### Mutations

- Auth: `register`, `login`
- User: `updateUser`, `deleteUser`
- Product: `createProduct`, `updateProduct`, `deleteProduct`
- Category: `createCategory`, `updateCategory`, `deleteCategory`
- Cart: `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`
- Order: `createOrder`, `updateOrderStatus`
- Wishlist: `addToWishlist`, `removeFromWishlist`