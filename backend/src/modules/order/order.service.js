const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class OrderService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = { isDeleted: false };

    if (query.status) {
      where.status = query.status;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.search) {
      where.customer = {
        name: { contains: query.search, mode: 'insensitive' },
      };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true } },
          items: {
            include: { product: { select: { id: true, name: true, sku: true } } },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return paginatedResponse(orders, total, page, limit);
  }

  static async getById(id) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
      },
    });

    if (!order) {
      throw AppError.notFound('Order not found');
    }

    return order;
  }

  static async create(data) {
    const { items, ...orderData } = data;

    // Verify customer exists
    const customer = await prisma.customer.findFirst({
      where: { id: orderData.customerId, isDeleted: false },
    });
    if (!customer) {
      throw AppError.badRequest('Customer not found');
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Use transaction to create order + items atomically
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          ...orderData,
          totalAmount,
          items: {
            create: items,
          },
        },
        include: {
          customer: { select: { id: true, name: true } },
          items: {
            include: { product: { select: { id: true, name: true, sku: true } } },
          },
        },
      });

      return created;
    });

    return order;
  }

  static async update(id, data) {
    const existing = await prisma.order.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Order not found');
    }

    const { items, ...orderData } = data;

    const order = await prisma.$transaction(async (tx) => {
      // If items provided, recalculate total and replace items
      if (items) {
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        orderData.totalAmount = totalAmount;

        // Delete existing items and recreate
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.orderItem.createMany({
          data: items.map((item) => ({ ...item, orderId: id })),
        });
      }

      return tx.order.update({
        where: { id },
        data: orderData,
        include: {
          customer: { select: { id: true, name: true } },
          items: {
            include: { product: { select: { id: true, name: true, sku: true } } },
          },
        },
      });
    });

    return order;
  }

  static async delete(id) {
    const existing = await prisma.order.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Order not found');
    }

    await prisma.order.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Order deleted successfully' };
  }
}

module.exports = OrderService;
