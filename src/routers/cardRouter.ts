import Router from 'express';
import * as cardController from '../controllers/cardController.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';
import activateCardSchema from '../schemas/activateCardSchema.js';
import cardRechargeSchema from '../schemas/cardRechargeSchema.js';
import createCardSchema from '../schemas/createCardSchema.js';

const cardRouter = Router();

cardRouter.post("/create_card", validateSchemaMiddleware(createCardSchema), cardController.createCard)
cardRouter.put("/cards/:id/activate", validateSchemaMiddleware(activateCardSchema), cardController.activateCard)
cardRouter.get("/cards/:id/balance", cardController.cardBalance)
cardRouter.post("/cards/:id/recharge", validateSchemaMiddleware(cardRechargeSchema), cardController.cardRecharge)

export default cardRouter;