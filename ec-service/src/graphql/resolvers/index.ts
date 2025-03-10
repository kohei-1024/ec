import { userResolvers } from './user';
import { productResolvers } from './product';
import { categoryResolvers } from './category';
import { cartResolvers } from './cart';
import { orderResolvers } from './order';
import { wishlistResolvers } from './wishlist';

// Merge all resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...cartResolvers.Query,
    ...orderResolvers.Query,
    ...wishlistResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...wishlistResolvers.Mutation,
  },
  // Type resolvers
  User: userResolvers.User,
  Product: productResolvers.Product,
  Category: categoryResolvers.Category,
  Cart: cartResolvers.Cart,
  CartItem: cartResolvers.CartItem,
  Order: orderResolvers.Order,
  OrderItem: orderResolvers.OrderItem,
  Wishlist: wishlistResolvers.Wishlist,
  WishlistItem: wishlistResolvers.WishlistItem,
};

export default resolvers;