import Router from 'express';
import * as purchaseController from '../controllers/purchaseController.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';
import purchaseSchema from '../schemas/purchaseSchema.js';

const purchaseRouter = Router();

purchaseRouter.post("/cards/:id/purchase", validateSchemaMiddleware(purchaseSchema), purchaseController.purchase)

export default purchaseRouter;