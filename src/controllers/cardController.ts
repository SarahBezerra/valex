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

    res.sendStatus(200)
}

async function cardBalance(req: Request, res: Response){
    const { cardId } = req.body;

    if (!cardId) {
        throw ("envie o identificador do cartão");
    }

    const balanceData = await cardService.cardBalance(cardId);

    res.status(200).send(balanceData);
}

async function cardRecharge(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'];
    const { cardId, amount } = req.body;

    if(!apiKey){
        throw ("chave de api não informada")
    }

    if (!cardId || !amount) {
        throw ("revise os dados enviados");
    }

    if (Number(amount) === 0) {
        throw ("o valor da recarga deve ser maior que zero");
    }

    await cardService.cardRecharge(apiKey.toString(), cardId, amount);

    res.sendStatus(200);
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
    cardBalance,
    cardRecharge
}