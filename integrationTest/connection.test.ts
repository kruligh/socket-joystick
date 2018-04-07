import {assert} from "chai";
import {Socket} from "socket.io";
import {RoomDto} from "../src/connectionService";

const io = require('socket.io-client');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const SHA256 = require("crypto-js/sha256");


const SERVER_URL = 'http://localhost:3000';

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
            console.log('connected');
            resolve(socket);
        });

        socket.on('error', (data: string) => {
            console.log(data);
            reject(data);
        });
    });
}

async function shouldThrow(fn: () => void) {
    try {
        await fn();
    } catch (error) {
        return;
    }
    assert.fail({}, {}, 'Should have reverted');
}

function getRoom(id: string): Promise<RoomDto> {
    return new Promise((resolve: Function, reject: Function) => {
        chai.request(SERVER_URL)
            .get(`/debug/room/${id}`)
            .end((err: any, res: any) => {
                resolve(res.body.data);
            });
    });
}

describe('Create room', () => {
    let roomId: string;
    const hostname = 'yeahbunny room';

    beforeEach(() => {
        roomId = SHA256(new Date().getMilliseconds() + 'probably its cryptojs a bug but i have to add this').toString();
    });

    it('Should create room', async () => {
        assert.isEmpty(await getRoom(roomId));

        const socket = await connect({roomId, nick: hostname});
        assert.isOk(socket);

        const roomAfter = await getRoom(roomId);
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