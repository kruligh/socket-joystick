"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const chai_1 = require("chai");
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const SERVER_URL = 'http://localhost:3000';
describe('Statics serving', () => {
    it('Should return index.html', () => __awaiter(this, void 0, void 0, function* () {
        yield testIfPathReturnsHTMLWithString('', '<title>WebStick</title>');
    }));
    it('Should return host.html', () => __awaiter(this, void 0, void 0, function* () {
        yield testIfPathReturnsHTMLWithString('/host', '<title>WebStick host</title>');
    }));
    it('Should return client.html', () => __awaiter(this, void 0, void 0, function* () {
        yield testIfPathReturnsHTMLWithString('/client', '<title>WebStick client</title>');
    }));
    it('Should return not found', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield helpers_1.promisifyRequest('get', '/blabla');
        chai_1.assert.equal(res.status, 404);
    }));
});
function testIfPathReturnsHTMLWithString(path, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield helpers_1.promisifyRequest('get', path);
        chai_1.assert.equal(res.status, 200);
        chai_1.assert.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
        chai_1.assert.ok(res.text.indexOf(query));
    });
}
