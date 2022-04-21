import * as cardService from './cardService.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import bcrypt from 'bcrypt';

async function purchase(cardId: number, businessId: number, password: string, price: number){
    const card = await cardService.validateCardId(cardId);

    cardService.validateExpirationDate(card.expirationDate);

    if(card.password === null){
        throw { type: 'bad_request', message: 'ative esse cartão para começar a comprar' }
    }    

    if(!(bcrypt.compareSync(password, card.password))){
        throw { type: 'unauthorized', message: 'senha incorreta' }
    }

    const business = await businessRepository.findById(businessId);
    if(!business){
        throw { type: 'not_found', message: 'estabelecimento não cadastrado' }
    }

    if(business.type !== card.type){
        throw { type: 'bad_request', message: 'tipo do cartão não compatível com este estabelecimento' }
    }

    const { balance } = await cardService.cardBalance(cardId);
    if(price > balance){
        throw { type: 'bad_request', message: 'saldo insuficiente' }
    }

    await paymentRepository.insert({ cardId, businessId, amount: price });
}

export {
    purchase
}
