const request = require('supertest');
const { expect } = require('chai')

describe('Transferências', () => {
    describe('POST /transferencias', ()  => {
        it('Deve retornar 201 quando ao realizar uma transferência o valor for igual ou maior que R$10,00', async() => {
            // Capturar o token
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    'username': 'julio.lima',
                    'senha': '123456'
                })

            const token = respostaLogin.body.token

            const resposta = await request('http://localhost:3000')
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
        it('Deve retornar 422 quando ao realizar uma transferência o valor for menor que R$10,00', async() => {
            // Capturar o token
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    'username': 'julio.lima',
                    'senha': '123456'
                })

            const token = respostaLogin.body.token

            const resposta = await request('http://localhost:3000')
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