import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addActivity,
  convertToOpportunity,
} from '../controllers/lead.controller';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAllLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize('admin', 'manager'), deleteLead);

router.post('/:id/activities', addActivity);
router.post('/:id/convert', authorize('manager', 'agent'), convertToOpportunity);

export default router;
