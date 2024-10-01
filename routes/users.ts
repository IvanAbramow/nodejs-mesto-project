import { Router } from 'express';
import { createUser, getUserById, getUsers, updateUserAvatar, updateUserInfo } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

export default router;
