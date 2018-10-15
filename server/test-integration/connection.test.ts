import {assert} from 'chai';
import {ClientConnectionQuery, EVENTS, HostConnectionQuery, MessageDto, RoomDto} from '../src/connectionService';
import {shouldThrow} from '../test/helpers';
import {createRoomId, promisifyRequest, SERVER_URL} from './helpers';
import {Socket} from 'socket.io';

const io = require('socket.io-client');

const sockets: Socket[] = [];

describe('Host', () => {
    const name = 'yeahbunny room';
    const game = 'yeahbunny game';
    let roomId: string;

    beforeEach(() => {
        roomId = createRoomId();
    });

    afterEach(() => {
        sockets.forEach(socket => {
            socket.disconnect(true);
        });
    });

    it('Should create room', async () => {
        assert.isEmpty(await debugApi.getRoom(roomId));

        const socket = await createHost({game, roomId, name, host: true});
        assert.isOk(socket);

        const roomAfter = await debugApi.getRoom(roomId);
        assert.equal(roomAfter.name, name);
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

    context('Room created', () => {
        let hostSocket: Socket;

        beforeEach(async () => {
            hostSocket = await createHost({game, roomId, name, host: true});
        });

        it('Should remove room when disconnect', (done) => {
            hostSocket.on(EVENTS.DISCONNECT, () => {
                debugApi.getRoom(roomId).then((room) => {
                    assert.isEmpty(room);
                    done();
                });
            });

            hostSocket.disconnect(true);
        });

        it('Should throw cause room exists', async () => {
            await shouldThrow(async () => {
                await createHost({game, roomId, name, host: true});
            });
        });
    });
});

describe('Client', () => {
    const nick = 'bede_gral_w_gre_69';
    const name = 'yeahbunny room';
    const game = 'yeahbunny game';

    let roomId: string;
    let hostSocket: Socket;

    it('Should throw if room does not exist', async () => {
        await shouldThrow(async () => {
            await connect({game, roomId, nick});
        });
    });

    context('Room created', () => {
        beforeEach(async () => {
            roomId = createRoomId();
            hostSocket = await createHost({game, roomId, name, host: true});
        });

        afterEach(() => {
            sockets.forEach(socket => {
                socket.disconnect(true);
            });
        });

        it('Should join room', async () => {
            assert.deepEqual((await debugApi.getRoom(roomId)).users, []);

            const playerSocket = await connect({game, roomId, nick});
            assert.isOk(playerSocket);

            const roomAfter = await debugApi.getRoom(roomId);
            assert.deepEqual(roomAfter.users, [{nick}]);
        });

        it('Should throw if nick exists in room', async () => {
            await connect({game, roomId, nick});

            await shouldThrow(async () => {
                await connect({game, roomId, nick});
            });
        });

        it('Should throw if query without roomId', async () => {
            await shouldThrow(async () => {
                await connectWithPartialQuery({game, nick});
            });
        });

        it('Should throw if query without nick', async () => {
            await shouldThrow(async () => {
                await connectWithPartialQuery({game, roomId});
            });
        });

        it('Should throw if query without game', async () => {
            await shouldThrow(async () => {
                await connectWithPartialQuery({roomId, nick});
            });
        });

        context('Connected to room', () => {
            let playerSocket: Socket;

            beforeEach(async () => {
                playerSocket = await connect({game, roomId, nick});
            });

            it('Should disconnect when host closed', (done) => {
                playerSocket.on(EVENTS.DISCONNECT, () => {
                    done();
                });

                hostSocket.disconnect(true);
            });

            it('Should remove user when disconnect', (done) => {
                playerSocket.on(EVENTS.DISCONNECT, () => {
                    debugApi.getRoom(roomId).then(room => {
                        assert.deepEqual(room.users, []);
                        done();
                    });
                });

                playerSocket.disconnect(true);
            });
        });
    });
});

describe('Sending message', () => {
    const nick = 'bede_gral_w_gre_69';
    const name = 'yeahbunny room';
    const game = 'yeahbunny game';

    let roomId: string;
    let hostSocket: Socket;
    let playerSocket: Socket;

    beforeEach(async () => {
        roomId = createRoomId();
        hostSocket = await createHost({game, roomId, name, host: true});
        playerSocket = await connect({game, roomId, nick});
    });

    afterEach(() => {
        sockets.forEach(socket => {
            socket.disconnect(true);
        });
    });

    it('Should send message to host', (done) => {
        const messageData = {payload: 'payload', type: 'typee'};
        hostSocket.on(EVENTS.MOVE, (rawMessage: string) => {
            const message: MessageDto = JSON.parse(rawMessage);
            assert.equal(message.payload, messageData.payload);
            assert.equal(message.type, messageData.type);
            done();
        });

        playerSocket.emit(EVENTS.MOVE, messageData);
    });

    it('Should decorate message by nick', (done) => {
        const messageData = {payload: 'payload', type: 'typee'};
        hostSocket.on(EVENTS.MOVE, (rawMessage: string) => {
            const message: MessageDto = JSON.parse(rawMessage);
            assert.equal(message.nick, nick);
            done();
        });

        playerSocket.emit(EVENTS.MOVE, messageData);
    });

    it('Should throw if message without type', (done) => {
        const messageData = {payload: 'payload'};
        playerSocket.on(EVENTS.ERROR, (err: any) => {
            done();
        });

        playerSocket.emit(EVENTS.MOVE, messageData);
    });

    it('Should throw if message without payload', (done) => {
        const messageData = {type: 'typee'};
        playerSocket.on(EVENTS.ERROR, (err: any) => {
            done();
        });

        playerSocket.emit(EVENTS.MOVE, messageData);
    });
});

function createHost(query: HostConnectionQuery): Promise<Socket> {
    return createHostWithPartialQuery(query);
}

function createHostWithPartialQuery(query: Partial<HostConnectionQuery>): Promise<Socket> {
    return connectWithQuery(query);
}

function connect(query: ClientConnectionQuery): Promise<Socket> {
    return connectWithPartialQuery(query);
}

function connectWithPartialQuery(query: Partial<ClientConnectionQuery>): Promise<Socket> {
    return connectWithQuery(query);
}

function connectWithQuery(query: any): Promise<Socket> {
    return new Promise((resolve: (_: any) => void, reject: (_: any) => void) => {
        const socket = io.connect(SERVER_URL, {query});

        sockets.push(socket);

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
