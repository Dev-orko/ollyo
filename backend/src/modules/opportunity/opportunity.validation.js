const { z } = require('zod');

const createOpportunitySchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  stage: z.enum(['LEAD', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  value: z.number().positive('Value must be positive').optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateOpportunitySchema = z.object({
  customerId: z.string().uuid().optional(),
  stage: z.enum(['LEAD', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  value: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const opportunityQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  stage: z.enum(['LEAD', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  customerId: z.string().uuid().optional(),
});

module.exports = { createOpportunitySchema, updateOpportunitySchema, opportunityQuerySchema };
