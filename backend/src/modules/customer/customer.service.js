const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class CustomerService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = { isDeleted: false };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return paginatedResponse(customers, total, page, limit);
  }

  static async getById(id) {
    const customer = await prisma.customer.findFirst({
      where: { id, isDeleted: false },
      include: {
        orders: { where: { isDeleted: false }, take: 5, orderBy: { createdAt: 'desc' } },
        opportunities: { where: { isDeleted: false }, take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!customer) {
      throw AppError.notFound('Customer not found');
    }

    return customer;
  }

  static async create(data) {
    return prisma.customer.create({ data });
  }

  static async update(id, data) {
    const existing = await prisma.customer.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Customer not found');
    }

    return prisma.customer.update({ where: { id }, data });
  }

  static async delete(id) {
    const existing = await prisma.customer.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Customer not found');
    }

    await prisma.customer.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Customer deleted successfully' };
  }
}

module.exports = CustomerService;
