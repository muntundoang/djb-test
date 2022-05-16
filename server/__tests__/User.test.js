const request = require('supertest');
const app = require('../app');

// Import Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

// Data Registration
const dataRegis = {
    username: 'usertest',
    role: 'test',
}

// Global variable 
let password
let access_token
let username
const expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW4iLCJpYXQiOjE2NTI3MDM0NzcsImV4cCI6MTY1MjcwMzQ4N30.8AFXVvOu4BeFsfhmGjKf9NkC34jOiELv-Y_nuKT9hf0'
const invalid_token = 'fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW4iLCJpYXQiOjE2NTI3MDMxODIsImV4cCI6MTY1Mjc0NjM4Mn0.PX1M3e6bsBPbWSmsNmua-6Ykl1u-reMAt5sun49fPNE'
const invalid_payload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fyJkYXRhIjoiYWRtaW4iLCJpYXQiOjE2NTI3MDMxODIsImV4cCI6MTY1Mjc0NjM4Mn0.PX1M3e6bsBPbWSmsNmua-6Ykl1u-reMAt5sun49fPNE'

// Delete After running test
afterAll(async () => {
    const testUsers = prisma.User.deleteMany()

    await prisma.$transaction([testUsers])

    await prisma.$disconnect()
})

// Running Test User
describe('POST users/register', () => {
    // --------------- Register Test ---------------
    describe('> Register Success', () => {
        it('- Should return 201 status code with message', async () => {

            const res = await request(app).post('/users/register').send(dataRegis)
            const registeredUser = await prisma.User.findUnique({
                where: {
                    username: dataRegis.username
                }
            })
            password = registeredUser.password
            userid = registeredUser.id
            username = registeredUser.username
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("message", expect.any(String));
            expect(res.body).toHaveProperty("message", expect.stringMatching(`ID ${userid} dengan username ${username} telah dibuat`));

        })
    })

    describe('> Register Fail', () => {
        describe('- Register Fail: Username Empty Field', () => {
            it(`Should return -> | status code: 400 | name: "registerFieldEmpty" | errCode: 9 | message: "Username or Role cannot be empty" |`, async () => {

                const res = await request(app).post('/users/register').send({ username: '', role: 'test' })
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`registerFieldEmpty`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(7)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Username or Role cannot be empty`));

            })
        })

        describe('- Register Fail: Role Empty Field', () => {
            it(`Should return -> | status code: 400 | name: "registerFieldEmpty" | errCode: 9 | message: "Username or Role cannot be empty" |`, async () => {

                const res = await request(app).post('/users/register').send({ username: 'test', role: '' })
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`registerFieldEmpty`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(7)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Username or Role cannot be empty`));

            })
        })

        describe('- Register Fail: Username Length < 4', () => {
            it(`Should return -> | status code: 400 | name: "registerUsernameLength" | errCode: 10 | message: "Username length must be at least 4 characters" |`, async () => {

                const res = await request(app).post('/users/register').send({ username: 'te', role: 'test' })
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`registerUsernameLength`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(8)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Username length must be at least 4 characters`));

            })
        })

        describe('- Register Fail: Username already exist', () => {
            it(`Should return -> | status code: 400 | name: "registerUsernameExist" | errCode: 11 | message: "Username already exist" |`, async () => {

                const res = await request(app).post('/users/register').send({ username: 'usertest', role: 'test' })
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`registerUsernameExist`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(9)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Username already exist`));

            })
        })
    })

    // --------------- Login Test ---------------
    describe('> Login Success', () => {
        it('- Should return 200 with body contain ID, username, expired_at, access_token', async () => {
            const loginData = {
                username: dataRegis.username,
                password: password
            }
            const res = await request(app).post('/users/login').send(loginData)
            access_token = res.body.access_token
            const registeredUser = await prisma.User.findUnique({
                where: {
                    username: dataRegis.username
                }
            })

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("ID");
            expect(res.body.ID).toBe(registeredUser.id);
            expect(res.body).toHaveProperty("username");
            expect(res.body.username).toBe(registeredUser.username);
            expect(res.body).toHaveProperty("access_token");
            expect(res.body).toHaveProperty("access_token", expect.any(String));
            expect(res.body).toHaveProperty("expired_at");
            expect(res.body).toHaveProperty("expired_at", expect.any(String));
        })
    })

    describe('> Login Fail', () => {
        describe('- Login Fail: Username Empty Field', () => {
            it(`Should return -> | status code: 400 | name: "loginFieldEmpty" | errCode: 4 | message: "Username or Password cannot be empty" |`, async () => {

                const res = await request(app).post('/users/login').send({ username: '', password: password })
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`loginFieldEmpty`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(4)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Username or Password cannot be empty`));

            })
        })

        describe('- Login Fail: Password Empty Field', () => {
            it(`Should return -> | status code: 400 | name: "loginFieldEmpty" | errCode: 4 | message: "Username or Password cannot be empty" |`, async () => {

                const res = await request(app).post('/users/login').send({ username: dataRegis.username, password: '' })
                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`loginFieldEmpty`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(4)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Username or Password cannot be empty`));

            })
        })

        describe('- Login Fail: Invalid Username', () => {
            it(`Should return -> | status code: 404 | name: "invalidUserusername" | errCode: 5 | message: "Invalid password or username" |`, async () => {

                const res = await request(app).post('/users/login').send({ username: 'invalid', password: password })
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`invalidUserusername`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(5)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Invalid password or username`));

            })
        })

        describe('- Login Fail: Invalid Password', () => {
            it(`Should return -> | status code: 404 | name: "invalidUserusername" | errCode: 5 | message: "Invalid password or username" |`, async () => {

                const res = await request(app).post('/users/login').send({ username: dataRegis.username, password: 'invalid' })
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`invalidUserusername`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(5)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Invalid password or username`));

            })
        })
    })

    // --------------- Authentication Test ---------------
    describe('> Authentication Success', () => {
        it('- Should return status 200 status code with body contain ID, username, expired_at', async () => {
            const res = await request(app).post('/users/auth').set({ access_token: access_token })
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("is_valid");
            expect(res.body).toHaveProperty("is_valid", expect.any(Boolean));
            expect(res.body.is_valid).toBe(true);
            expect(res.body).toHaveProperty("username");
            expect(res.body).toHaveProperty("username", expect.any(String));
            expect(res.body).toHaveProperty("username", expect.stringMatching(username));
            expect(res.body).toHaveProperty("expired_at");
            expect(res.body).toHaveProperty("expired_at", expect.any(String));
        })
    })

    describe('> Authentication Fail', () => {
        describe('- Invalid Token ( Header or Verify Signature )', () => {
            it(`Should return -> | status code: 401 | name: "JsonWebTokenError" | errCode: 1 | message: "Invalid Authentication Token" |`, async () => {
                const res = await request(app).post('/users/auth').set({ access_token: invalid_token })
                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`JsonWebTokenError`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(1)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Invalid Authentication Token`));
            })
        })

        describe('- Invalid Token Payload', () => {
            it(`Should return -> | status code: 401 | name: "SyntaxError" | errCode: 6 | message: "Invalid Authentication Token" |`, async () => {
                const res = await request(app).post('/users/auth').set({ access_token: invalid_payload })
                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`SyntaxError`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(6)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Invalid Authentication Token`));
            })
        })

        describe('- Token Expired', () => {
            it(`Should return -> | status code: 401 | name: "TokenExpiredError" | errCode: 10 | message: "Token Expired" |`, async () => {
                const res = await request(app).post('/users/auth').set({ access_token: expired_token })
                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("name");
                expect(res.body).toHaveProperty("name", expect.any(String));
                expect(res.body).toHaveProperty("name", expect.stringMatching(`TokenExpiredError`));
                expect(res.body).toHaveProperty("errCode");
                expect(res.body).toHaveProperty("errCode", expect.any(Number));
                expect(res.body.errCode).toBe(10)
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("message", expect.any(String));
                expect(res.body).toHaveProperty("message", expect.stringMatching(`Current Token is expired. please Relogin`));
            })
        })
    })
})