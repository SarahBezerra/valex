import { Request, Response } from 'express';
import * as purchaseService from '../services/purchaseService.js';

async function purchase(req: Request, res: Response){
    const { cardId, businessId, password, price } = req.body;

    if(!cardId || !businessId || !password || !price){
        throw ("revise os dados enviados")
    }

    if(Number(price) === 0){
        throw ("a compra deve ser maior do que R$ 0,00")
    }

    await purchaseService.purchase(cardId, businessId, password, price);

    res.sendStatus(200);
}

export {
    purchase
}