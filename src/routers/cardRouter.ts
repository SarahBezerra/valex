import Router from 'express';
import * as cardController from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post("/create_card", cardController.createCard)
cardRouter.post("/activate_card", cardController.activateCard)
cardRouter.get("/balance", cardController.cardBalance)
cardRouter.post("/card_recharge", cardController.cardRecharge)

export default cardRouter;