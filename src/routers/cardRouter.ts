import Router from 'express';
import * as cardController from '../controllers/cardController.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';
import activateCardSchema from '../schemas/activateCardSchema.js';
import balanceSchema from '../schemas/balanceSchema.js';
import cardRechargeSchema from '../schemas/cardRechargeSchema.js';
import createCardSchema from '../schemas/createCardSchema.js';

const cardRouter = Router();

cardRouter.post("/create_card", validateSchemaMiddleware(createCardSchema), cardController.createCard)
cardRouter.put("/activate_card", validateSchemaMiddleware(activateCardSchema), cardController.activateCard)
cardRouter.get("/balance", validateSchemaMiddleware(balanceSchema), cardController.cardBalance)
cardRouter.post("/card_recharge", validateSchemaMiddleware(cardRechargeSchema), cardController.cardRecharge)

export default cardRouter;