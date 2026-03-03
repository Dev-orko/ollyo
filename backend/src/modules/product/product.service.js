const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class ProductService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = { isDeleted: false };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.supplierId) {
      where.supplierId = query.supplierId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { supplier: { select: { id: true, name: true } } },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(products, total, page, limit);
  }

  static async getById(id) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        supplier: { select: { id: true, name: true, email: true } },
      },
    });

    if (!product) {
      throw AppError.notFound('Product not found');
    }

    return product;
  }

  static async create(data) {
    // Verify supplier exists
    const supplier = await prisma.supplier.findFirst({
      where: { id: data.supplierId, isDeleted: false },
    });
    if (!supplier) {
      throw AppError.badRequest('Supplier not found');
    }

    return prisma.product.create({
      data,
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  static async update(id, data) {
    const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Product not found');
    }

    if (data.supplierId) {
      const supplier = await prisma.supplier.findFirst({
        where: { id: data.supplierId, isDeleted: false },
      });
      if (!supplier) {
        throw AppError.badRequest('Supplier not found');
      }
    }

    return prisma.product.update({
      where: { id },
      data,
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  static async delete(id) {
    const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Product not found');
    }

    await prisma.product.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Product deleted successfully' };
  }
}

module.exports = ProductService;
