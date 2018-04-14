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
const chai_1 = require("chai");
const connectionService_1 = require("../src/connectionService");
const helpers_1 = require("../test/helpers");
const helpers_2 = require("./helpers");
const io = require('socket.io-client');
const SHA256 = require("crypto-js/sha256");
const SERVER_URL = 'http://localhost:3000';
describe('Create room', () => {
    const hostname = 'yeahbunny room';
    let roomId;
    beforeEach(() => {
        roomId = SHA256(new Date().getMilliseconds() + 'probably its cryptojs a bug but i have to add this').toString();
    });
    it('Should create room', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.isEmpty(yield debugApi.getRoom(roomId));
        const socket = yield connect({ roomId, nick: hostname });
        chai_1.assert.isOk(socket);
        const roomAfter = yield debugApi.getRoom(roomId);
        chai_1.assert.equal(roomAfter.name, hostname);
    }));
    it('Should throw if query without roomId', () => __awaiter(this, void 0, void 0, function* () {
        yield helpers_1.shouldThrow(() => __awaiter(this, void 0, void 0, function* () {
            yield connectWithPartialQuery({ nick: hostname });
        }));
    }));
    it('Should throw if query without nick', () => __awaiter(this, void 0, void 0, function* () {
        yield helpers_1.shouldThrow(() => __awaiter(this, void 0, void 0, function* () {
            yield connectWithPartialQuery({ roomId });
        }));
    }));
});
describe('Join to room', () => {
    const hostname = 'yeahbunny room';
    const playerNick = 'Alek';
    let roomId;
    let hostSocket;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        roomId = createRoomId();
        hostSocket = yield connect({ roomId, nick: hostname });
        chai_1.assert.isOk(hostSocket);
    }));
    it('Should join room', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.assert.equal((yield debugApi.getRoom(roomId)).users.length, 0);
        const playerSocket = yield connect({ roomId, nick: playerNick });
        chai_1.assert.isOk(playerSocket);
        const roomAfter = yield debugApi.getRoom(roomId);
        chai_1.assert.equal(roomAfter.users.length, 1);
        chai_1.assert.isOk(roomAfter.users.find(item => item.nick === playerNick));
    }));
});
describe('Sending message', () => {
    const hostname = 'yeahbunny room';
    const playerNick = 'Alek';
    let hostSocket;
    let playerSocket;
    let roomId;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        roomId = createRoomId();
        hostSocket = yield connect({ roomId, nick: hostname });
        chai_1.assert.isOk(hostSocket);
        playerSocket = yield connect({ roomId, nick: playerNick });
        chai_1.assert.isOk(playerSocket);
    }));
    it('Should send message to host', (done) => {
        const messageData = 'bla bla';
        hostSocket.on(connectionService_1.EVENTS.MOVE, (rawMessage) => {
            const message = JSON.parse(rawMessage);
            chai_1.assert.equal(message.data, messageData);
            chai_1.assert.equal(message.nick, playerNick);
            done();
        });
        playerSocket.emit(connectionService_1.EVENTS.MOVE, messageData);
    });
});
function createRoomId() {
    return SHA256(new Date().getMilliseconds() + 'probably its cryptojs a bug but i have to add this').toString();
}
function connect(query) {
    return connectWithPartialQuery(query);
}
const debugApi = {
    getRoom: (id) => __awaiter(this, void 0, void 0, function* () {
        const res = yield helpers_2.promisifyRequest('get', `/room/${id}`);
        return res.body.data;
    })
};
function connectWithPartialQuery(query) {
    return new Promise(function (resolve, reject) {
        const socket = io.connect(SERVER_URL, { query });
        socket.on('connect', () => {
            resolve(socket);
        });
        socket.on('error', (data) => {
            reject(data);
        });
    });
}
