import {promisifyRequest} from "./helpers";
import {assert} from "chai";

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const SERVER_URL = 'http://localhost:3000';

describe('Statics serving', () => {
    it('Should return index.html', async () => {
        await testIfPathReturnsHTMLWithString('', '<title>WebStick</title>')
    });

    it('Should return host.html', async () => {
        await testIfPathReturnsHTMLWithString('/host', '<title>WebStick host</title>')
    });

    it('Should return client.html', async () => {
        await testIfPathReturnsHTMLWithString('/client', '<title>WebStick client</title>')
    });

    it('Should return not found', async () => {
        const res: any = await promisifyRequest('get', '/blabla');
        assert.equal(res.status, 404);
    });
});

async function testIfPathReturnsHTMLWithString(path: string, query: string) {
    const res: any = await promisifyRequest('get', path);
    assert.equal(res.status, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
    assert.ok((res.text as string).indexOf(query));
}
