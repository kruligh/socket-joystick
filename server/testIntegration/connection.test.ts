import {assert} from 'chai';
import {Socket} from 'socket.io';
import {HostConnectionQuery, RoomDto} from '../src/connectionService';
import {shouldThrow} from '../test/helpers';
import {createRoomId, promisifyRequest} from './helpers';

const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:3000';

describe('Create room', () => {
    const name = 'yeahbunny room';
    const game = 'yeahbunny game';
    let roomId: string;

    beforeEach(() => {
        roomId = createRoomId();
    });

    it('Should create room', async () => {
        assert.isEmpty(await debugApi.getRoom(roomId));

        const socket = await createHost({game, roomId, name, host: true});
        assert.isOk(socket);

        const roomAfter = await debugApi.getRoom(roomId);
            console.log(roomAfter);
        assert.equal(roomAfter.name, name);
    });

    it('Should throw if room exists', async () => {
        await createHost({game, roomId, name, host: true});

        await shouldThrow(async () => {
            await createHost({game, roomId, name, host: true});
        });
    });

    it('Should throw if query without roomId', async () => {
        await shouldThrow(async () => {
            await createHostWithPartialQuery({game, name, host: true});
        });
    });

    it('Should throw if query without name', async () => {
        await shouldThrow(async () => {
            await createHostWithPartialQuery({game, roomId, host: true});
        });
    });

    it('Should throw if query without game', async () => {
        await shouldThrow(async () => {
            await createHostWithPartialQuery({name, roomId, host: true});
        });
    });

    it('Should throw if host false', async () => {
        await shouldThrow(async () => {
            await createHostWithPartialQuery({game, roomId, name, host: false});
        });
    });

    it('Should throw if host undefined', async () => {
        await shouldThrow(async () => {
            await createHostWithPartialQuery({game, roomId, name});
        });
    });
});
/*

describe('Join to room', () => {
    const name = 'yeahbunny room';
    const game = 'yeahbunny game';
    const nick = 'bede_gral_w_gre_69';

    let hostSocket: Socket;
    let roomId: string;

    beforeEach(async () => {
        roomId = createRoomId();
        hostSocket = await createHost({roomId, });
        assert.isOk(hostSocket);
    });

    it('Should join room', async () => {
        assert.equal((await debugApi.getRoom(roomId)).users.length, 0);

        const playerSocket = await connect({roomId, nick: nick});
        assert.isOk(playerSocket);

        const roomAfter = await debugApi.getRoom(roomId);
        assert.equal(roomAfter.users.length, 1);
        assert.isOk(roomAfter.users.find(item => item.nick === nick));
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
        const messageData = {payload: 'payload', type: 'typee'};
        hostSocket.on(EVENTS.MOVE, (rawMessage: string) => {
            const message: MessageDto = JSON.parse(rawMessage);
            assert.equal(message.nick, playerNick);
            assert.equal(message.payload, messageData.payload);
            assert.equal(message.type, messageData.type);
            done();
        });

        playerSocket.emit(EVENTS.MOVE, messageData);
    });
});
*/

function createHost(query: HostConnectionQuery): Promise<Socket> {
    return createHostWithPartialQuery(query);
}

function createHostWithPartialQuery(query: Partial<HostConnectionQuery>): Promise<Socket> {

    return new Promise((resolve: (_: any) => void, reject: (_: any) => void) => {
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
    getRoom: async (id: string): Promise<RoomDto> => {
        const res = await promisifyRequest('get', `/room/${id}`);
        return res.body.data as RoomDto;
    }
};
