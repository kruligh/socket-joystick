import {Express} from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import socketIO = require('socket.io');

export enum EVENTS {
    MOVE = 'move',
}

interface User {
    nick: string;
    socket: Socket;
}

interface RoomEntry {
    name: string;
    host: Socket;
    users: User[];
}

// dk todo
function checkHostQueryParams(query: any, next: (_: any) => void) {
    const game = query['game'];
    const roomId = query['roomId'];

    const name = query['name'];

    const nick = query['nick'];
    next(new Error());
}

// dk todo
function checkClientQueryParams(query: any, next: (_: any) => void) {
    const game = query['game'];
    const roomId = query['roomId'];

    const name = query['name'];

    const nick = query['nick'];
}

function checkParams(socket: Socket, next: (_?: any) => void) {
    const query = socket.handshake.query;

    if (query['host']) {
        checkHostQueryParams(query, next);
    } else {
        checkClientQueryParams(query, next);
    }
    next();
}

export class ClientService {

    private rooms: Map<string, RoomEntry>;

    constructor(app: Express, listenOn: http.Server) {
        this.rooms = new Map<string, RoomEntry>();

        const httpServer = new http.Server(app);

        const io = socketIO(httpServer);

        io.use(checkParams);

        io.on('connection', async (socket) => {
            const host = socket.handshake.query['host'];
            if (host) {
                this.createRoom(socket);
            } else {
                this.joinRoom(socket);
            }
        });

        io.listen(listenOn);
    }

    public getRoom(id: string): RoomDto | {} {
        const roomEntry = this.rooms.get(id);
        if (!roomEntry) {
            return {};
        }
        return {
            name: roomEntry.name,
            users: roomEntry.users.reduce(
                (acc: Array<{ nick: string }>, item: User) => [...acc, {nick: item.nick}],
                []
            ),
        };
    }

    private createRoom(socket: Socket) {
        const query: HostConnectionQuery = {
            game: socket.handshake.query['game'],
            host: socket.handshake.query['host'],
            name: socket.handshake.query['name'],
            roomId: socket.handshake.query['roomId'],
        };

        if (this.rooms.get(query.roomId)) {
            throw new Error(`Room ${query.roomId} exists`);
        }

        const room: RoomEntry = {
            host: socket,
            name: query.name,
            users: []
        };
        this.rooms.set(query.roomId, room);

        console.log(`Room ${query.name}(${query.roomId}) created`);
    }

    private joinRoom(socket: Socket) {
        const query: ClientConnectionQuery = {
            game: socket.handshake.query['game'],
            nick: socket.handshake.query['nick'],
            roomId: socket.handshake.query['roomId'],
        };

        const room: RoomEntry | undefined = this.rooms.get(query.roomId);
        if (!room) {
            // todo make invalid response
            throw new Error(`Room ${query.roomId} does not exists`);
        }

        room.users = [...room.users, {nick: query.nick, socket}];
        console.log(`${query.nick} successful connected to room ${room.name}(${query.roomId})`);

        socket.on(EVENTS.MOVE, (data: any) => {
            // todo dk check data.payload and data.type
            const message: MessageDto = {
                nick: query.nick,
                payload: data.payload,
                type: data.type,
            };
            room!.host.emit(EVENTS.MOVE, JSON.stringify(message));
        });
    }
}

export interface RoomDto {
    name: string;
    users: Array<{ nick: string }>;
}

export interface MessageDto {
    nick: string;
    payload: string;
    type: string;
}

interface ConnectionQuery {
    game: string;
    roomId: string;
}

export interface HostConnectionQuery extends ConnectionQuery {
    host: boolean;
    name: string;
}

export interface ClientConnectionQuery extends ConnectionQuery {
    nick: string;
}
