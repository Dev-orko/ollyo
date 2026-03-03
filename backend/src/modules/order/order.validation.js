const { z } = require('zod');

const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
});

const createOrderSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  orderDate: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, 'At least one order item is required'),
});

const updateOrderSchema = z.object({
  customerId: z.string().uuid().optional(),
  orderDate: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1).optional(),
});

const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
  customerId: z.string().uuid().optional(),
});

module.exports = { createOrderSchema, updateOrderSchema, orderQuerySchema };
