import Router from 'express';
import * as purchaseController from '../controllers/purchaseController.js';

const purchaseRouter = Router();

purchaseRouter.post("/purchase", purchaseController.purchase)

export default purchaseRouter;