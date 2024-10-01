import { Router } from 'express';
import { addCard, deleteCard, dislikeCard, getCards, likeCard, } from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', addCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router;
