import {assert} from "chai";
import {Socket} from "socket.io";

const SERVER_URL = 'http://localhost:3000';

const io = require('socket.io-client');

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

describe('Connect', () => {
    const roomId = 'xyzhashmagicroomid';
    const hostname = 'yeahbunny room';

    it('Should create room', async () => {
        const socket = await connect({roomId, nick: hostname});
        assert.isOk(socket);
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