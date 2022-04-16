import * as cardRepository from '../repositories/cardRepository.js';
import { validateExpirationDate, amount } from './cardService.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import bcrypt from 'bcrypt';

async function purchase(cardId: number, businessId: number, password: string, price: number){
    const card = await cardRepository.findById(cardId);
    if(!card){
        throw ("cartão não encontrado")
    }

    const isExpirationDateValid = validateExpirationDate(card.expirationDate);
    if(!isExpirationDateValid){
        throw ("cartão fora da data de validade")
    }

    if(card.password === null){
        throw ("ative esse cartão para começar a comprar")
    }    

    if(!(bcrypt.compareSync(password, card.password))){
        throw ("senha incorreta")
    }

    const business = await businessRepository.findById(businessId);
    if(!business){
        throw ("estabelecimento não cadastrado")
    }

    if(business.type !== card.type){
        throw ("tipo do cartão não compatível com este estabelecimento")
    }

    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    const rechargesSum = amount(recharges)
    const transactionsSum = amount(transactions)
    const balance = rechargesSum - transactionsSum;
    if(price > balance){
        throw ("saldo insuficiente")
    }

    await paymentRepository.insert({ cardId, businessId, amount: price });
}

export {
    purchase
}
