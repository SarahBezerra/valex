import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js'
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

    await cardService.createCard(apiKey.toString(), employeeId, cardType);

    res.sendStatus(201)
}

async function activateCard(req: Request, res: Response){
    const { cardId, cvv, password } = req.body;

    if (!cardId || !cvv || !password) {
        throw ("revise os dados enviados");
    }

    await cardService.activateCard(cardId, cvv, password);

    res.sendStatus(201)
}

async function cardBalance(req: Request, res: Response){
    const { cardId } = req.body;

    if (!cardId) {
        throw ("envie o identificador do cartão");
    }

    const balanceData = await cardService.cardBalance(cardId);

    res.status(200).send(balanceData);
}

function validateCardType(cardType: TransactionTypes) {
    const cardTypes: string[] = ['groceries', 'restaurant', 'transport', 'education', 'health'];
    if (!cardTypes.includes(cardType.toLowerCase())) {
        throw ("tipo de cartão inválido");
    }
}

export {
    createCard,
    activateCard,
    cardBalance
}