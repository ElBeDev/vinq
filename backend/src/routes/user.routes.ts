import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

router.use(protect);

router.get('/', authorize('admin', 'manager'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
