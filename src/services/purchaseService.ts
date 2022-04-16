import * as cardService from './cardService.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import bcrypt from 'bcrypt';

async function purchase(cardId: number, businessId: number, password: string, price: number){
    const card = await cardService.validateCardId(cardId);

    cardService.validateExpirationDate(card.expirationDate);

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

    const { balance } = await cardService.cardBalance(cardId);
    if(price > balance){
        throw ("saldo insuficiente")
    }

    await paymentRepository.insert({ cardId, businessId, amount: price });
}

export {
    purchase
}
