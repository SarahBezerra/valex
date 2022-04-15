import Router from 'express';
import * as cardController from '../controllers/cardController.js';

const router = Router();

router.post("/create_card", cardController.createCard)

export default router;