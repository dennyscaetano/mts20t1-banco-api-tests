const request = require('supertest');
const { expect } = require('chai')

describe('Transferências', () => {
    describe('POST /transferencias', ()  => {
        it('Deve retornar 201 quando tiver sucesso', async() => {
            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .send({
                    'contaOrigem': 1,
                    'contaDestino': 2,
                    'valor': 137.59,
                    'token': '123456'
                    })

            console.log(resposta.status)
            console.log(resposta.body)
            
            expect(resposta.status).to.equal(201);
            expect(resposta.body.message).to.be.equal('Transferência realizada com sucesso.');
        })
    })
})