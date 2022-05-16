if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const jwt = require('jsonwebtoken');
const keyAuth = process.env.keyAuth

const readPayloadToken = (token) => {
    let {data, iat, exp} = jwt.verify(token, keyAuth)
    let timeStamp = new Date(exp * 1000)
    let expired_at = timeStamp.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'full' })
    const tokenRes = {
        data: data,
        expired_at: expired_at
    }
    return tokenRes
}

const payloadTokenGenerate = (payload) => {
    const token = jwt.sign({data: payload}, keyAuth, { expiresIn: '12h' })
    const {expired_at, data} = readPayloadToken(token)
    const tokenRes = {
        access_token: token,
        expired_at: expired_at
    }
    return tokenRes
}

module.exports = {
    payloadTokenGenerate,
    readPayloadToken
}