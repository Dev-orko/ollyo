const prisma = require('../../config/database');

class DashboardService {
  static async getOverview() {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const [
      totalCustomers,
      totalSuppliers,
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      expiringCertifications,
      recentLogs,
      opportunitiesByStage,
      recentOrders,
    ] = await Promise.all([
      prisma.customer.count({ where: { isDeleted: false } }),
      prisma.supplier.count({ where: { isDeleted: false } }),
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.order.count({ where: { isDeleted: false } }),
      prisma.order.count({ where: { isDeleted: false, status: 'PENDING' } }),
      prisma.order.count({ where: { isDeleted: false, status: 'COMPLETED' } }),
      prisma.order.count({ where: { isDeleted: false, status: 'CANCELLED' } }),
      prisma.certification.findMany({
        where: {
          isDeleted: false,
          expiryDate: { lte: thirtyDaysFromNow, gte: now },
        },
        include: { supplier: { select: { id: true, name: true } } },
        orderBy: { expiryDate: 'asc' },
        take: 10,
      }),
      prisma.complianceLog.findMany({
        include: { createdBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.opportunity.groupBy({
        by: ['stage'],
        where: { isDeleted: false },
        _count: { id: true },
        _sum: { value: true },
      }),
      prisma.order.findMany({
        where: { isDeleted: false },
        include: { customer: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      counts: {
        customers: totalCustomers,
        suppliers: totalSuppliers,
        products: totalProducts,
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
      },
      expiringCertifications,
      recentLogs,
      opportunitiesByStage: opportunitiesByStage.map((item) => ({
        stage: item.stage,
        count: item._count.id,
        totalValue: item._sum.value,
      })),
      recentOrders,
    };
  }
}

module.exports = DashboardService;
