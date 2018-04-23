const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const SHA256 = require('crypto-js/sha256');

const SERVER_URL = 'http://localhost:3000';

export function createRoomId(): string {
    return SHA256(new Date().getMilliseconds() + 'probably its cryptojs a bug but i have to add this').toString();
}

export function promisifyRequest(method: string, path: string, body?: any): Promise<any> {
    return new Promise((resolve: (data: any) => void, reject: (err: any) => void) => {
        chai.request(SERVER_URL)[method](path).end((err: any, res: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}