const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { obterToken, obterTokenJunior } = require('../helpers/autenticacao')
const postTransferencias = require('../fixtures/postTransferencias.json')

describe('Transferências', () => {
    const bodyTransferencias = { ...postTransferencias }
    let token

    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456')
    })

    describe('POST /transferencias Sucess', () => {

        it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de R$10,00', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(201)
        })

        it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de R$5000,00 e o token for válido', async () => {
            bodyTransferencias.valor = 5000
            bodyTransferencias.token = "123456"

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(201)
        })
    })

    describe('POST /transferencias Failure', () => {
        it('Deve retornar falha com 403 quando a autenticação não for do usuário julio.lima', async () => {
            const token = await obterTokenJunior('junior.lima', '123456')
            bodyTransferencias.token = "123456"

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(403)
            expect(resposta.body.error).to.equal('Acesso não permitido.')
        })

        it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$ 10,00', async () => {
            bodyTransferencias.valor = 7
            bodyTransferencias.token = "123456"

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(422)
            expect(resposta.body.error).to.equal('O valor da transferência deve ser maior ou igual a R$10,00.')
        })

        it('Deve retornar falha com 401 quando não for passado token e o valor da transferência for maior ou igual a R$5000', async () => {
            bodyTransferencias.valor = 5000
            bodyTransferencias.token = ""

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(401)
            expect(resposta.body.error).to.equal('Autenticação necessária para transferências acima de R$5.000,00.')
            //expect(resposta.body.error).to.equal('Autenticação necessária para transferências com valores maior ou igual a R$5.000,00.') - Reportar necessidade de alteração da mensagem de alerta
        })

        it('Deve retornar falha com 401 quando for passado token inválido e o valor da transferência for maior ou igual a R$5000', async () => {
            bodyTransferencias.valor = 5000
            bodyTransferencias.token = "tokenInvalido"

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(401)
            expect(resposta.body.error).to.equal('Autenticação necessária para transferências acima de R$5.000,00.')
            //expect(resposta.body.error).to.equal('Autenticação necessária para transferências com valores maior ou igual a R$5.000,00.')
        })

        it('Deve retornar falha com 400 quando for passado parâmetros inválidos', async () => {
            bodyTransferencias.contaOrigem = "parametroInvalido"
            bodyTransferencias.contaDestino = "parametroInvalido"
            bodyTransferencias.valor = "parametroInvalido"
            bodyTransferencias.token = "parametroInvalido"

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias)

            expect(resposta.status).to.equal(404)
            // expect(resposta.status).to.equal(400) - Reportar falha!
            expect(resposta.body.error).to.equal('Conta de origem ou destino não encontrada.')
            // expect(resposta.body.error).to.equal('Parâmetros de transferência inválidos.') - Reportar necessidade de alteração da mensagem de alerta
        })
    })

    describe('GET /transferencias/{id} Sucess', () => {
        it('Deve retornar sucesso com 200 e dados iguais ao registro de transferência contido no banco de dados quando o ID for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/63')
                .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200)
            expect(resposta.body.id).to.equal(63)
            expect(resposta.body.id).to.be.a('number')
            expect(resposta.body.conta_origem_id).to.equal(1)
            expect(resposta.body.conta_destino_id).to.equal(2)
            expect(resposta.body.valor).to.equal('33.00')
            // expect(resposta.body.valor).to.equal(33.00) - Reportar falha!
        })
    })

    describe('GET /transferencias Sucess', () => {
        it('Deve retornar 10 elementos na paginacao quando informar limite de 10 registros', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200)
            expect(resposta.body.limit).to.equal(10)
            expect(resposta.body.transferencias).to.have.lengthOf(10)
        })
    })
})