const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const postLogin = require('../fixtures/postLogin.json')


describe('Login', () => {
    const bodyLogin = { ...postLogin}

    describe('POST /login', () => {
        it('Deve retornar 200 com token em string quando usar credenciais válidas', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)
                

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.be.a('string');
        })
        it('Deve retornar 400 quando não for passado parâmetro username', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    'senha': '123456'
                })

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha são obrigatórios.');
        })
        it('Deve retornar 400 quando não for passado parâmetro senha', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    'username': 'junior.lima'
                })

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha são obrigatórios.');
        })
        it('Deve retornar 401 quando for passado credenciais inválidas', async () => {
            bodyLogin.username = 'credenciais.inválidas'

            const resposta = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Usuário ou senha inválidos.');
        })
    })
    describe('OTHER METHODS /login', () => {
        it('Deve retornar 405 quando tentar utilizar verbo GET em /login', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(405);
            expect(resposta.body.error).to.equal('Método não permitido.');
        })
        it('Deve retornar 405 quando tentar utilizar verbo PUT em /login', async () => {
            const resposta = await request(process.env.BASE_URL)
                .put('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(405);
            expect(resposta.body.error).to.equal('Método não permitido.');
        })
        it('Deve retornar 405 quando tentar utilizar verbo PATCH em /login', async () => {
            const resposta = await request(process.env.BASE_URL)
                .patch('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(405);
            expect(resposta.body.error).to.equal('Método não permitido.');
        })
        it('Deve retornar 405 quando tentar utilizar verbo DELETE em /login', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(405);
            expect(resposta.body.error).to.equal('Método não permitido.');
        })
        it('Deve retornar 405 quando tentar utilizar verbo OPTIONS em /login', async () => {
            const resposta = await request(process.env.BASE_URL)
                .options('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            // console.log(resposta.status)
            // console.log(resposta.body)

            expect(resposta.status).to.equal(405);
            expect(resposta.body.error).to.equal('Método não permitido.');
        })
    })
})