import { Request, Response } from 'express';
import * as purchaseService from '../services/purchaseService.js';

async function purchase(req: Request, res: Response){
    const { id } = req.params;
    const { businessId, password, price } = req.body;

    if(!id || !businessId || !password || !price){
        throw { type: 'bad_request', message: 'revise os dados enviados' }
    }

    if(Number(price) === 0){
        throw { type: 'bad_request', message: 'a compra deve ser maior do que R$ 0,00' }
    }

    await purchaseService.purchase(Number(id), businessId, password, price);

    res.sendStatus(200);
}

export {
    purchase
}