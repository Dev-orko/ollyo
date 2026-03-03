const { z } = require('zod');

const createComplianceLogSchema = z.object({
  type: z.enum([
    'ALLERGEN',
    'AUDIT',
    'DOCUMENT',
    'FEEDBACK',
    'NON_CONFORMANCE',
    'RISK',
    'TRAINING',
    'RECALL',
  ]),
  relatedEntityType: z.string().optional().nullable(),
  relatedEntityId: z.string().optional().nullable(),
  description: z.string().min(1, 'Description is required'),
});

const updateComplianceLogSchema = z.object({
  type: z
    .enum([
      'ALLERGEN',
      'AUDIT',
      'DOCUMENT',
      'FEEDBACK',
      'NON_CONFORMANCE',
      'RISK',
      'TRAINING',
      'RECALL',
    ])
    .optional(),
  relatedEntityType: z.string().optional().nullable(),
  relatedEntityId: z.string().optional().nullable(),
  description: z.string().min(1).optional(),
});

const complianceLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  type: z
    .enum([
      'ALLERGEN',
      'AUDIT',
      'DOCUMENT',
      'FEEDBACK',
      'NON_CONFORMANCE',
      'RISK',
      'TRAINING',
      'RECALL',
    ])
    .optional(),
});

module.exports = { createComplianceLogSchema, updateComplianceLogSchema, complianceLogQuerySchema };
