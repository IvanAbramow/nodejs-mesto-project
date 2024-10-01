import { Router } from 'express';
import { addCard, deleteCard, getCards } from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', addCard);
router.delete('/cards/:cardId', deleteCard);

export default router;
