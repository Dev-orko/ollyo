const { z } = require('zod');

const createCertificationSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID'),
  type: z.enum(['HALAL', 'KOSHER', 'ISO', 'FSSC', 'OTHER']),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  documentUrl: z.string().optional().nullable(),
});

const updateCertificationSchema = z.object({
  supplierId: z.string().uuid().optional(),
  type: z.enum(['HALAL', 'KOSHER', 'ISO', 'FSSC', 'OTHER']).optional(),
  issueDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  documentUrl: z.string().optional().nullable(),
});

const certificationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  type: z.enum(['HALAL', 'KOSHER', 'ISO', 'FSSC', 'OTHER']).optional(),
  supplierId: z.string().uuid().optional(),
  expiringSoon: z.enum(['true', 'false']).optional(),
});

module.exports = { createCertificationSchema, updateCertificationSchema, certificationQuerySchema };
