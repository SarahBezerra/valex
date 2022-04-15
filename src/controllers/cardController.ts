import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js'

async function createCard(req: Request, res: Response){
    const apiKey = req.headers['x-api-key'];
    await validateApiKey(apiKey)

    const { employeeId, cardType } = req.body;
    validateCard(employeeId, cardType);

    res.sendStatus(201)
}

async function validateApiKey(apiKey: string | string[]) {
    if(!apiKey){
        throw ("chave de api não informada")
    }

    await cardService.validateApiKey(apiKey.toString())
}

function validateCard(employeeId: string, cardType: string) {
    if (!employeeId || !cardType) {
        throw ("revise os dados enviados");
    }

    const cardTypes: string[] = ['groceries', 'restaurants', 'transport', 'education', 'health'];
    if (!cardTypes.includes(cardType.toLowerCase())) {
        throw ("Tido de cartão inválido");
    }
}

export {
    createCard
}