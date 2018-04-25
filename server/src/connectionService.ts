import {Express, NextFunction} from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import socketIO = require('socket.io');

export enum EVENTS {
    ERROR = 'app_error',
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

export class ClientService {

    private rooms: Map<string, RoomEntry>;

    constructor(app: Express, listenOn: http.Server) {
        this.rooms = new Map<string, RoomEntry>();

        const httpServer = new http.Server(app);

        const io = socketIO(httpServer);

        io.use((socket, next) => {
            const host = socket.handshake.query['host'];
            let query: ConnectionQuery;
            if (host) {
                query = this.extractHostQuery(socket.handshake.query);
            } else {
                query = this.extractClientQuery(socket.handshake.query);
            }

            for (const key of Object.keys(query)){
                if (!socket.handshake.query[key]) {
                    this.throwConnection(next, `${key} is not defined in client query`);
                    return;
                }
            }

            if (host == 'true') {
                this.createRoom(socket, next);
            } else {
                this.joinRoom(socket, next);
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

    private createRoom(socket: Socket, next: NextFunction) {
        const query = this.extractHostQuery(socket.handshake.query);

        if (this.rooms.get(query.roomId)) {
            this.throwConnection(next, `Room ${query.roomId} exists`);
            return;
        }

        const room: RoomEntry = {
            host: socket,
            name: query.name,
            users: []
        };
        this.rooms.set(query.roomId, room);

        console.log(`Room ${query.name}(${query.roomId}) created`);
        next();
    }

    private joinRoom(socket: Socket, next: NextFunction) {
        const query = this.extractClientQuery(socket.handshake.query);


        const room: RoomEntry = this.rooms.get(query.roomId)!;
        if (!room) {
            this.throwConnection(next, `Room ${query.roomId.substr(0,8)} does not exists`);
            return;
        }

        console.log(room.users, room.users.find(user => user.nick === query.nick));
        if (room.users.find(user => user.nick === query.nick)) {
            this.throwConnection(next, `User ${query.nick} exists in room ${query.roomId.substr(0,8)}`);
            return;
        }

        room.users = [...room.users, {nick: query.nick, socket}];

        socket.on(EVENTS.MOVE, (data: any) => {
            // todo dk check data.payload and data.type
            const message: MessageDto = {
                nick: query.nick,
                payload: data.payload,
                type: data.type,
            };

            for (const key of Object.keys(message)){
                if (!(message as any)[key]) {
                    const errorMsg = `${key} is not defined in message ${JSON.stringify(message)}`;
                    console.error(errorMsg);
                    socket.emit(EVENTS.ERROR, {errorMsg});
                    return;
                }
            }

            room!.host.emit(EVENTS.MOVE, JSON.stringify(message));
        });

        console.log(`${query.nick} successfully connected to room ${room.name}(${query.roomId.substr(0,8)})`);
        next();
    }

    private extractHostQuery(query: any): HostConnectionQuery {
        return {
            game: query['game'],
            host: query['host'],
            name: query['name'],
            roomId: query['roomId'],
        };
    }

    private extractClientQuery(query: any): ClientConnectionQuery {
        return {
            game: query['game'],
            nick: query['nick'],
            roomId: query['roomId'],
        };
    }

    private throwConnection(next: NextFunction, msg: string) {
        console.error(msg);
        next(new Error(msg));
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
