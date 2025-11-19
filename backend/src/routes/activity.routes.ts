import express from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getTodayActivities,
  getPendingActivities,
  completeActivity,
} from '../controllers/activity.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas especiales
router.get('/today', getTodayActivities);
router.get('/pending', getPendingActivities);
router.patch('/:id/complete', completeActivity);

// CRUD básico
router
  .route('/')
  .get(getActivities)
  .post(createActivity);

router
  .route('/:id')
  .get(getActivity)
  .patch(updateActivity)
  .delete(deleteActivity);

export default router;
