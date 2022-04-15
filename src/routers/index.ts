import Router from 'express';
import * as cardController from '../controllers/cardController.js';

const router = Router();

router.post("/create_card", cardController.createCard)
router.post("/activate_card", cardController.activateCard)

export default router;