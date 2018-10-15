import {Express, NextFunction} from 'express';
import * as http from 'http';
import {Socket} from 'socket.io';
import socketIO = require('socket.io');

export enum EVENTS {
    DISCONNECT = 'disconnect',
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

    constructor() {
        this.rooms = new Map<string, RoomEntry>();
    }

    public init(app: Express, listenOn: http.Server){
        const httpServer = new http.Server(app);
        const io = socketIO(httpServer);

        io.use(this.handleConnection);

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

    private handleConnection = (socket: Socket, next: NextFunction) => {
        const host = socket.handshake.query['host'];
        let query: ConnectionQuery;
        if (host == 'true') {
            query = ClientService.extractHostQuery(socket.handshake.query);
        } else {
            query = ClientService.extractClientQuery(socket.handshake.query);
        }

        for (const key of Object.keys(query)) {
            if (!socket.handshake.query[key]) {
                ClientService.throwConnection(next, `${key} is not defined in client query`);
                return;
            }
        }

        if (host == 'true') {
            this.createRoom(socket, next);
        } else {
            this.joinRoom(socket, next);
        }
    };

    private createRoom = (socket: Socket, next: NextFunction) => {
        const query = ClientService.extractHostQuery(socket.handshake.query);

        if (this.rooms.get(query.roomId)) {
            ClientService.throwConnection(next, `Room ${query.roomId} exists`);
            return;
        }

        socket.on(EVENTS.DISCONNECT, () => {
            const room = this.rooms.get(query.roomId);
            if (room) {
                room.users.forEach((user) => {
                    user.socket.disconnect(true);
                });
                this.rooms.delete(query.roomId);

                console.log(`Room ${query.name}(${query.roomId}) closed by host`);
            }
        });

        const room: RoomEntry = {
            host: socket,
            name: query.name,
            users: []
        };
        this.rooms.set(query.roomId, room);

        console.log(`Room ${query.name}(${query.roomId}) created`);
        next();
    };

    private joinRoom = (socket: Socket, next: NextFunction) => {
        const query = ClientService.extractClientQuery(socket.handshake.query);

        const room: RoomEntry = this.rooms.get(query.roomId)!;
        if (!room) {
            ClientService.throwConnection(next, `Room ${query.roomId} does not exists`);
            return;
        }

        if (room.users.find(user => user.nick === query.nick)) {
            ClientService.throwConnection(next, `User ${query.nick} exists in room ${query.roomId}`);
            return;
        }

        const user: User = {nick: query.nick, socket};
        room.users = [...room.users, user];

        socket.on(EVENTS.MOVE, (data: any) => {
            const message: MessageDto = {
                nick: query.nick,
                payload: data.payload,
                type: data.type,
            };

            for (const key of Object.keys(message)) {
                if (!(message as any)[key]) {
                    const errorMsg = `${key} is not defined in message ${JSON.stringify(message)}`;
                    console.error(errorMsg);
                    socket.emit(EVENTS.ERROR, {errorMsg});
                    return;
                }
            }

            room!.host.emit(EVENTS.MOVE, JSON.stringify(message));
        });

        socket.on(EVENTS.DISCONNECT, () => {
            room.users = room.users.filter(roomUser => roomUser.nick !== user.nick);
            console.log(`${query.nick} disconnected with room ${room.name}(${query.roomId})`);
        });

        console.log(`${query.nick} successfully connected to room ${room.name}(${query.roomId})`);
        next();
    };

    private static extractHostQuery(query: any): HostConnectionQuery {
        return {
            game: query['game'],
            host: query['host'],
            name: query['name'],
            roomId: query['roomId'],
        };
    }

    private static extractClientQuery(query: any): ClientConnectionQuery {
        return {
            game: query['game'],
            nick: query['nick'],
            roomId: query['roomId'],
        };
    }

    private static throwConnection(next: NextFunction, msg: string) {
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
