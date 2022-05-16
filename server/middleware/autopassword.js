const generator = require('generate-password');

let password = () => {
    return generator.generate({
        length: 6,
        strict: true,
        numbers: true
    });
}

// console.log(password())

module.exports = password