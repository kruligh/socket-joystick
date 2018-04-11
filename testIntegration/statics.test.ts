import {promisifyRequest} from "./helpers";
import {assert} from "chai";

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const SERVER_URL = 'http://localhost:3000';

describe('Statics serving', () => {
    it('Should return index.html', async () => {
        const res: any = await promisifyRequest('get', '');
        assert.equal(res.status, 200);
        assert.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
    });

    it('Should return not found', async () => {
        const res: any = await promisifyRequest('get', '/blabla');
        assert.equal(res.status, 404);
    });
});
