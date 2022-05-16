const bcrypt = require('bcrypt');


//fungsi bantuan
const hashPassword = (text) => {
    return bcrypt.hashSync(text, 10);
}

//fungsi bantuan compare
const comparePasswordWithHash = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hashPassword,
    comparePasswordWithHash
}