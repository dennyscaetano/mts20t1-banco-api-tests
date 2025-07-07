const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao')

describe('Transferências', () => {
    describe('POST /transferencias', () => {
        let token

        beforeEach(async () => {
            // Capturar o token
            token = await obterToken('julio.lima', '123456')
        })
        it('Deve retornar 201 quando ao realizar uma transferência o valor for igual ou maior que R$10,00', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    'contaOrigem': 1,
                    'contaDestino': 2,
                    'valor': 10.00,
                    'token': ''
                })

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(201);
            expect(resposta.body.message).to.be.equal('Transferência realizada com sucesso.');
        })
        it('Deve retornar 422 quando ao realizar uma transferência o valor for menor que R$10,00', async () => {

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    'contaOrigem': 1,
                    'contaDestino': 2,
                    'valor': 9.99,
                    'token': ''
                })

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(422);
            expect(resposta.body.error).to.be.equal('O valor da transferência deve ser maior ou igual a R$10,00.');
        })
    })
})