"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};
exports.default = generateSecretKey;
