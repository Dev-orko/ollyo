const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class ComplianceLogService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      where.description = { contains: query.search, mode: 'insensitive' };
    }

    const [logs, total] = await Promise.all([
      prisma.complianceLog.findMany({
        where,
        include: { createdBy: { select: { id: true, name: true } } },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.complianceLog.count({ where }),
    ]);

    return paginatedResponse(logs, total, page, limit);
  }

  static async getById(id) {
    const log = await prisma.complianceLog.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    });

    if (!log) {
      throw AppError.notFound('Compliance log not found');
    }

    return log;
  }

  static async create(data, userId) {
    return prisma.complianceLog.create({
      data: {
        ...data,
        createdById: userId,
      },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  static async update(id, data) {
    const existing = await prisma.complianceLog.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound('Compliance log not found');
    }

    return prisma.complianceLog.update({
      where: { id },
      data,
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  static async delete(id) {
    const existing = await prisma.complianceLog.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound('Compliance log not found');
    }

    await prisma.complianceLog.delete({ where: { id } });
    return { message: 'Compliance log deleted successfully' };
  }
}

module.exports = ComplianceLogService;
