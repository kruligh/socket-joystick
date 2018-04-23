const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const SERVER_URL = 'http://localhost:3000';


export function promisifyRequest(method: string, path: string, body?: any): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
        chai.request(SERVER_URL)[method](path).end((err: any, res: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}