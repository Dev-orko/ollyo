const prisma = require('../config/database');

/**
 * Audit logging middleware.
 * Logs create/update/delete actions automatically.
 */
const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Only log on successful operations
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const entityId = body?.data?.id || req.params?.id || null;

        prisma.auditLog
          .create({
            data: {
              action,
              entityType,
              entityId: entityId ? String(entityId) : null,
              userId: req.user.id,
              metadata: {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
              },
            },
          })
          .catch((err) => console.error('Audit log error:', err));
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
