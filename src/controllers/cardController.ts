import { Request, Response } from 'express';
import { validateCard } from '../services/cardService.js'
import { TransactionTypes } from '../repositories/cardRepository.js';

async function createCard(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'];
    const { employeeId, cardType } = req.body;

    if(!apiKey){
        throw ("chave de api não informada")
    }

    if (!employeeId || !cardType) {
        throw ("revise os dados enviados");
    }

    validateCardType(cardType);

    await validateCard(apiKey.toString(), employeeId, cardType);

    res.sendStatus(201)
}


function validateCardType(cardType: TransactionTypes) {
    const cardTypes: string[] = ['groceries', 'restaurant', 'transport', 'education', 'health'];
    if (!cardTypes.includes(cardType.toLowerCase())) {
        throw ("Tido de cartão inválido");
    }
}

export {
    createCard
}