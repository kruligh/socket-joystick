"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const SERVER_URL = 'http://localhost:3000';
function promisifyRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        chai.request(SERVER_URL)[method](path).end((err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.promisifyRequest = promisifyRequest;
