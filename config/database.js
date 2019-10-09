const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb+srv://Ade:pzukLECtbhvRiEDR@cluster0-fwqpb.mongodb.net/node-angular',
    secret: crypto,
    db: 'Jeli'
}