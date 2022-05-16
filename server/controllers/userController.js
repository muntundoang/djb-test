const { PrismaClient, Prisma } = require('@prisma/client')
const password = require('../middleware/autopassword')
const { comparePasswordWithHash, hashPassword } = require('../helpers/brcrypt');
const { payloadTokenGenerate, readPayloadToken } = require('../helpers/jwt');
const errHandler = require('../helpers/errorHandler');
// const {OAuth2Client} = require('google-auth-library');

const prisma = new PrismaClient()

class userController {

    static async register(req, res) {
        try {

            const { username, role } = req.body
            // const hashedPassword = hashPassword(password)
            const option = {
                where: {
                    username: username
                }
            }

            if (username === "" || role === "" || !username || !role) {
                throw { name: 'registerFieldEmpty' }
            } else if (username.length < 4) {
                throw { name: 'registerUsernameLength' }
            }

            const userData = await prisma.User.findUnique(option)

            if (userData) {
                throw { name: 'registerUsernameExist' }
            }

            const data = await prisma.User.create({
                data: {
                    username,
                    password: password(),
                    role,
                }
            })

            res.status(201).json({ message: `ID ${data.id} dengan username ${data.username} telah dibuat` })

        } catch (err) {
            const error = errHandler(err)
            res.status(error.status).json(error)
        }
    }

    static async login(req, res) {

        const { username, password } = req.body

        try {
            if (username === "" || password === "" || !username || !password) {
                throw { name: 'loginFieldEmpty' }
            }
            const option = {
                where: {
                    username: username
                }
            }
            const userData = await prisma.User.findUnique(option)

            if (!userData) {

                throw { name: 'invalidUserusername' }

            } else {

                const validPass = password === userData.password ? true : false

                if (!validPass) {

                    throw { name: 'invalidUserusername' }

                } else {

                    const payload = userData.username
                    const {access_token, expired_at} = payloadTokenGenerate(payload)

                    res.status(200).json({
                        ID: userData.id,
                        access_token: access_token,
                        expired_at: expired_at,
                        username: userData.username
                    })
                }
            }
        } catch (err) {

            const error = errHandler(err)
            res.status(error.status).json(error)

        }

    }

    static async findUser(req, res) {
        try {
            const user = await prisma.User.findMany({})
            res.status(200).json(user)
        } catch (err) {
            const error = errHandler(err)
            res.status(error.status).json(error)
        }
    }

    static async authentication(req, res) {
        try {
            const { access_token } = req.headers
            const payload = readPayloadToken(access_token)
            const {data, expired_at} = payload
            const userLogin = await prisma.User.findUnique({
                where: {
                    username: data
                }
            })
            if (!userLogin || !payload) {
                throw { name: 'AuthenticationFailUserNotFound' }
            } else {
                res.status(200).json({
                    is_valid: true,
                    expired_at,
                    username: userLogin.username
                })
            }
        } catch (err) {
            const error = errHandler(err)
            res.status(error.status).json(error)
        }
    }

}

module.exports = userController