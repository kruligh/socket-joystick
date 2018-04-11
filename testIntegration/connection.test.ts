import {assert} from "chai";
import {Socket} from "socket.io";
import {EVENTS, MessageDto, RoomDto} from "../src/server/connectionService";
import {shouldThrow} from "../test/helpers";

const io = require('socket.io-client');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const SHA256 = require("crypto-js/sha256");


const SERVER_URL = 'http://localhost:3000';

describe('Create room', () => {
    const hostname = 'yeahbunny room';

    let roomId: string;

    beforeEach(() => {
        roomId = SHA256(new Date().getMilliseconds() + 'probably its cryptojs a bug but i have to add this').toString();
    });

    it('Should create room', async () => {
        assert.isEmpty(await debugApi.getRoom(roomId));

        const socket = await connect({roomId, nick: hostname});
        assert.isOk(socket);

        const roomAfter = await debugApi.getRoom(roomId);
        assert.equal(roomAfter.name, hostname);
    });

    it('Should throw if query without roomId', async () => {
        await shouldThrow(async () => {
            await connectWithPartialQuery({nick: hostname})
        });
    });

    it('Should throw if query without nick', async () => {
        await shouldThrow(async () => {
            await connectWithPartialQuery({roomId});
        });
    });
});

describe('Join to room', () => {
    const hostname = 'yeahbunny room';
    const playerNick = 'Alek';

    let roomId: string;
    let hostSocket: Socket;

    beforeEach(async () => {
        roomId = createRoomId();
        hostSocket = await connect({roomId, nick: hostname});
        assert.isOk(hostSocket);
    });

    it('Should join room', async () => {
        assert.equal((await debugApi.getRoom(roomId)).users.length, 0);

        const playerSocket = await connect({roomId, nick: playerNick});
        assert.isOk(playerSocket);

        const roomAfter = await debugApi.getRoom(roomId);
        assert.equal(roomAfter.users.length, 1);
        assert.isOk(roomAfter.users.find(item => item.nick === playerNick));
    });
});

describe('Sending message', () => {
    const hostname = 'yeahbunny room';
    const playerNick = 'Alek';

    let hostSocket: Socket;
    let playerSocket: Socket;
    let roomId: string;

    beforeEach(async () => {
        roomId = createRoomId();
        hostSocket = await connect({roomId, nick: hostname});
        assert.isOk(hostSocket);
        playerSocket = await connect({roomId, nick: playerNick});
        assert.isOk(playerSocket);
    });

    it('Should send message to host', (done) => {
        const messageData = 'bla bla';
        hostSocket.on(EVENTS.MOVE, (rawMessage: string) => {
            const message: MessageDto = JSON.parse(rawMessage);
            assert.equal(message.data, messageData);
            assert.equal(message.nick, playerNick);
            done();
        });

        playerSocket.emit(EVENTS.MOVE, messageData);
    });
});

function createRoomId(): string {
    return SHA256(new Date().getMilliseconds() + 'probably its cryptojs a bug but i have to add this').toString();
}

interface ConnectionQuery {
    roomId: string;
    nick: string;
}

function connect(query: ConnectionQuery): Promise<Socket> {
    return connectWithPartialQuery(query);
}

function connectWithPartialQuery(query: Partial<ConnectionQuery>): Promise<Socket> {
    return new Promise(function (resolve: Function, reject: Function) {
        const socket = io.connect(SERVER_URL, {query});

        socket.on('connect', () => {
            resolve(socket);
        });

        socket.on('error', (data: string) => {
            reject(data);
        });
    });
}

const debugApi = {
    getRoom: (id: string): Promise<RoomDto> => {
        return new Promise((resolve: Function, reject: Function) => {
            chai.request(SERVER_URL)
                .get(`/debug/room/${id}`)
                .end((err: any, res: any) => {
                    resolve(res.body.data);
                });
        });
    }
};
