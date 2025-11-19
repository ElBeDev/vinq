import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from '../controllers/property.controller';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAllProperties)
  .post(authorize('admin', 'manager', 'agent'), createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(authorize('admin', 'manager', 'agent'), updateProperty)
  .delete(authorize('admin', 'manager'), deleteProperty);

export default router;
