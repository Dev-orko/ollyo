const router = require('express').Router();
const opportunityController = require('./opportunity.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createOpportunitySchema,
  updateOpportunitySchema,
  opportunityQuerySchema,
} = require('./opportunity.validation');

router.use(authenticate);

router.get('/', validate(opportunityQuerySchema, 'query'), opportunityController.getAll);
router.get('/:id', opportunityController.getById);
router.post('/', validate(createOpportunitySchema), auditLog('CREATE', 'Opportunity'), opportunityController.create);
router.put('/:id', validate(updateOpportunitySchema), auditLog('UPDATE', 'Opportunity'), opportunityController.update);
router.delete('/:id', auditLog('DELETE', 'Opportunity'), opportunityController.remove);

module.exports = router;
