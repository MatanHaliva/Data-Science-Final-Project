const jwt = require('jsonwebtoken');

const privateKey = 'my private key'
let secret = [
    '-----BEGIN PRIVATE KEY-----',
    'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAkcd7iupXSHhgIRat',
    'b2gnEiyC3AIf7GCrISTtgM5Lb8kccGjunU8sIqwwd3BV6qD+pExeyvMyU085RHRX',
    'ud1cyQIDAQABAkAzmni6GPAiwDHPJLbqK+VAwq7j8ICabTHGvsqwANalT/O4V75m',
    'e2ExeqV05+jlzVOGrQ953n8Mx1u0uRgPlfoBAiEAyO3qytGKRRzlqBuGwPFPde4a',
    '66ZW4AmRcBwwuKp1zgkCIQC5u/2j/JFzM4GTbpoC0a2u78+tqYQW7Y/Usu6AAubI',
    'wQIhAMKbhMQJ7UUBNwH6HyryzcZn5pUEl7IIMmAGPb4uA0mZAiAbJPhawQzY00w6',
    'qc1kYBSMHowxiza8yxdcNJJarxHfgQIgcw2oEtn8GbvNMOsFg0Q9TPMdQ+uhxhWK',
    'xhVgWkIkTVU=',
    '-----END PRIVATE KEY-----',
].join('\n');


const createJwt = async ({email, password}) => {
    return new Promise((resolve, reject) => {
        console.log("tokening creating")
        
        try {
            var token = jwt.sign({email, password}, secret, { algorithm: 'RS256'});

        } catch (err) {
            console.log(err)
            reject(err)
        }

        resolve(token)
    })
}

const decodeJwt = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            var decoded = jwt.verify(token, secret, {algorithms: 'RS256 '});
            resolve(decoded)
        } catch (err) {
            reject({error: "could not verify", errorType: err})
        }
    })
}

module.exports = {
    createJwt,
    decodeJwt
}