import socketIO = require('socket.io');
import {Socket} from "socket.io";
import {Express} from "express";
import * as http from "http";

interface User {
    nick: string;
    socket: Socket;
}

interface RoomEntry {
    name: string;
    host: Socket;
    users: User[];
}

export class ClientService {

    private rooms: Map<string, RoomEntry>;

    constructor(app: Express, listenOn: http.Server) {
        this.rooms = new Map<string, RoomEntry>();

        const httpServer = new http.Server(app);

        const io = socketIO(httpServer);

        io.use((socket: Socket, next: Function) => {
            const roomId = socket.handshake.query['roomId'];
            const nick = socket.handshake.query['nick'];

            if (!roomId || !nick) {
                next(new Error(`Handshake query invalid: ${JSON.stringify(socket.handshake.query)}`));
            } else {
                console.log(`a user ${nick} try to connect to room ${roomId}`);
                next();
            }
        });

        io.on('connection', async (socket) => {
            const roomId = socket.handshake.query['roomId'];
            const nick = socket.handshake.query['nick'];

            const room = this.rooms.get(roomId);
            if (!room) {
                this.rooms.set(roomId, {
                    name: nick,
                    host: socket,
                    users: []
                });
                console.log(`Room ${nick}(${roomId}) created`)
            } else {
                room.users = [...room.users, {nick, socket}];
                console.log(`${nick} successful connected to room ${room.name}(${roomId})`);
            }

            //todo set listeners to socket
            /*this.socketListenersMap.forEach((fn, eventName) => {
                socket.on(eventName, fn(characterId));
            });*/
        });

        io.listen(listenOn);
    }

    getRoom(id: string): RoomDto | {} {
        const roomEntry = this.rooms.get(id);
        if(!roomEntry) {
            return {};
        }
        return {
            name: roomEntry.name,
            users: roomEntry.users.reduce((acc:{ nick: string }[], item: User) => [...acc, {nick: item.nick}], []),
        };
    }
}

export interface RoomDto {
    name: string,
    users: { nick: string }[]
}
