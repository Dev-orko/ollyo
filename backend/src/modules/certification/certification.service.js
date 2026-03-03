const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class CertificationService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = { isDeleted: false };

    if (query.type) {
      where.type = query.type;
    }

    if (query.supplierId) {
      where.supplierId = query.supplierId;
    }

    if (query.expiringSoon === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      where.expiryDate = { lte: thirtyDaysFromNow, gte: new Date() };
    }

    if (query.search) {
      where.supplier = {
        name: { contains: query.search, mode: 'insensitive' },
      };
    }

    const [certifications, total] = await Promise.all([
      prisma.certification.findMany({
        where,
        include: { supplier: { select: { id: true, name: true } } },
        skip,
        take,
        orderBy: { expiryDate: 'asc' },
      }),
      prisma.certification.count({ where }),
    ]);

    return paginatedResponse(certifications, total, page, limit);
  }

  static async getById(id) {
    const certification = await prisma.certification.findFirst({
      where: { id, isDeleted: false },
      include: { supplier: { select: { id: true, name: true, email: true } } },
    });

    if (!certification) {
      throw AppError.notFound('Certification not found');
    }

    return certification;
  }

  static async create(data) {
    const supplier = await prisma.supplier.findFirst({
      where: { id: data.supplierId, isDeleted: false },
    });
    if (!supplier) {
      throw AppError.badRequest('Supplier not found');
    }

    return prisma.certification.create({
      data,
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  static async update(id, data) {
    const existing = await prisma.certification.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Certification not found');
    }

    if (data.supplierId) {
      const supplier = await prisma.supplier.findFirst({
        where: { id: data.supplierId, isDeleted: false },
      });
      if (!supplier) {
        throw AppError.badRequest('Supplier not found');
      }
    }

    return prisma.certification.update({
      where: { id },
      data,
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  static async delete(id) {
    const existing = await prisma.certification.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Certification not found');
    }

    await prisma.certification.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Certification deleted successfully' };
  }

  static async getExpiringSoon(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.certification.findMany({
      where: {
        isDeleted: false,
        expiryDate: { lte: futureDate, gte: new Date() },
      },
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { expiryDate: 'asc' },
    });
  }
}

module.exports = CertificationService;
