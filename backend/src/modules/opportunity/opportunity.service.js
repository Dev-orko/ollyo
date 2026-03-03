const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class OpportunityService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = { isDeleted: false };

    if (query.stage) {
      where.stage = query.stage;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.search) {
      where.OR = [
        { notes: { contains: query.search, mode: 'insensitive' } },
        { customer: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        include: { customer: { select: { id: true, name: true } } },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.opportunity.count({ where }),
    ]);

    return paginatedResponse(opportunities, total, page, limit);
  }

  static async getById(id) {
    const opportunity = await prisma.opportunity.findFirst({
      where: { id, isDeleted: false },
      include: { customer: { select: { id: true, name: true, email: true } } },
    });

    if (!opportunity) {
      throw AppError.notFound('Opportunity not found');
    }

    return opportunity;
  }

  static async create(data) {
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, isDeleted: false },
    });
    if (!customer) {
      throw AppError.badRequest('Customer not found');
    }

    return prisma.opportunity.create({
      data,
      include: { customer: { select: { id: true, name: true } } },
    });
  }

  static async update(id, data) {
    const existing = await prisma.opportunity.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Opportunity not found');
    }

    if (data.customerId) {
      const customer = await prisma.customer.findFirst({
        where: { id: data.customerId, isDeleted: false },
      });
      if (!customer) {
        throw AppError.badRequest('Customer not found');
      }
    }

    return prisma.opportunity.update({
      where: { id },
      data,
      include: { customer: { select: { id: true, name: true } } },
    });
  }

  static async delete(id) {
    const existing = await prisma.opportunity.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Opportunity not found');
    }

    await prisma.opportunity.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Opportunity deleted successfully' };
  }
}

module.exports = OpportunityService;
