import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js'
import { TransactionTypes } from '../repositories/cardRepository.js';

async function createCard(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'] as string;
    const { employeeId, cardType } = req.body;

    if(!apiKey){
        throw { type: 'unauthorized', message: 'chave não informada' }
    }

    await cardService.createCard(apiKey, employeeId, cardType);

    res.sendStatus(201)
}

async function activateCard(req: Request, res: Response){
    const { id } = req.params;
    const { cvv, password } = req.body;

    if(!id || !cvv || !password){
        throw { type: 'unauthorized', message: 'revise os dados enviados' }
    }

    await cardService.activateCard(Number(id), cvv, password);

    res.sendStatus(200)
}

async function cardBalance(req: Request, res: Response){
    const { id } = req.params;

    if(!id){
        throw { type: 'unauthorized', message: 'revise os dados enviados' }
    }

    const balanceData = await cardService.cardBalance(Number(id));

    res.status(200).send(balanceData);
}

async function cardRecharge(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'] as string;
    const { amount } = req.body;
    const { id } = req.params;

    if(!id){
        throw { type: 'bad_request', message: 'revise os dados enviados' }
    }

    if(!apiKey){
        throw { type: 'bad_request', message: 'chave de api não informada' }
    }

    if (Number(amount) === 0) {
        throw { type: 'bad_request', message: 'o valor da recarga deve ser maior que R$0,00' }
    }

    await cardService.cardRecharge(apiKey, Number(id), amount);

    res.sendStatus(200);
}

export {
    createCard,
    activateCard,
    cardBalance,
    cardRecharge
}