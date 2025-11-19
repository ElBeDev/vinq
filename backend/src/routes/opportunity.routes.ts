import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  addActivity,
  updateStage,
} from '../controllers/opportunity.controller';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAllOpportunities)
  .post(authorize('manager', 'agent'), createOpportunity);

router.route('/:id')
  .get(getOpportunityById)
  .put(authorize('manager', 'agent'), updateOpportunity)
  .delete(authorize('admin', 'manager'), deleteOpportunity);

router.post('/:id/activities', addActivity);
router.patch('/:id/stage', authorize('manager', 'agent'), updateStage);

export default router;
