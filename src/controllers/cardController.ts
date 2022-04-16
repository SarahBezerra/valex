import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js'
import { TransactionTypes } from '../repositories/cardRepository.js';

async function createCard(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'];
    const { employeeId, cardType } = req.body;

    if(!apiKey){
        throw ("chave de api não informada")
    }

    await cardService.createCard(apiKey.toString(), employeeId, cardType);

    res.sendStatus(201)
}

async function activateCard(req: Request, res: Response){
    const { cardId, cvv, password } = req.body;

    await cardService.activateCard(cardId, cvv, password);

    res.sendStatus(200)
}

async function cardBalance(req: Request, res: Response){
    const { cardId } = req.body;

    const balanceData = await cardService.cardBalance(cardId);

    res.status(200).send(balanceData);
}

async function cardRecharge(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'];
    const { cardId, amount } = req.body;

    if(!apiKey){
        throw ("chave de api não informada")
    }

    if (Number(amount) === 0) {
        throw ("o valor da recarga deve ser maior que zero");
    }

    await cardService.cardRecharge(apiKey.toString(), cardId, amount);

    res.sendStatus(200);
}

export {
    createCard,
    activateCard,
    cardBalance,
    cardRecharge
}