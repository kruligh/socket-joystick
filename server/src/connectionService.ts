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

function checkParams(socket: Socket, next: () => void) {
    const query = socket.handshake.query;
    const game = query['game'];
    const roomId = query['roomId'];

    const host = query['host'];
    const name = query['name'];

    const nick = query['nick'];
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
            const game = socket.handshake.query['game'];
            const roomId = socket.handshake.query['roomId'];
            let room = this.rooms.get(roomId);
            // todo refactor and tests
            if (host) {
                const name = socket.handshake.query['name'];

                if (room) {
                    throw new Error(`Room ${roomId} exists`);
                }

                room = {
                    host: socket,
                    name,
                    users: []
                };
                this.rooms.set(roomId, room);
                console.log(`Room ${name}(${roomId}) created`);

            } else {
                const nick = socket.handshake.query['nick'];

                if (!room) {
                    // todo make invalid response
                    throw new Error(`Room ${roomId} does not exists`);
                }

                room.users = [...room.users, {nick, socket}];
                console.log(`${nick} successful connected to room ${room.name}(${roomId})`);

                socket.on(EVENTS.MOVE, (data: any) => {
                    // todo dk check data.payload and data.type
                    const message: MessageDto = {
                        nick,
                        payload: data.payload,
                        type: data.type,
                    };
                    room!.host.emit(EVENTS.MOVE, JSON.stringify(message));
                });
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
