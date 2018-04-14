"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketIO = require("socket.io");
const http = require("http");
var EVENTS;
(function (EVENTS) {
    EVENTS["MOVE"] = "move";
})(EVENTS = exports.EVENTS || (exports.EVENTS = {}));
class ClientService {
    constructor(app, listenOn) {
        this.rooms = new Map();
        const httpServer = new http.Server(app);
        const io = socketIO(httpServer);
        io.use((socket, next) => {
            const roomId = socket.handshake.query['roomId'];
            const nick = socket.handshake.query['nick'];
            if (!roomId || !nick) {
                next(new Error(`Handshake query invalid: ${JSON.stringify(socket.handshake.query)}`));
            }
            else {
                console.log(`a user ${nick} try to connect to room ${roomId}`);
                next();
            }
        });
        io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            const roomId = socket.handshake.query['roomId'];
            const nick = socket.handshake.query['nick'];
            let room = this.rooms.get(roomId);
            if (!room) {
                room = {
                    name: nick,
                    host: socket,
                    users: []
                };
                this.rooms.set(roomId, room);
                console.log(`Room ${nick}(${roomId}) created`);
            }
            else {
                room.users = [...room.users, { nick, socket }];
                console.log(`${nick} successful connected to room ${room.name}(${roomId})`);
            }
            socket.on(EVENTS.MOVE, (data) => {
                const message = { nick, data };
                console.log(message);
                room.host.emit(EVENTS.MOVE, JSON.stringify(message));
            });
        }));
        io.listen(listenOn);
    }
    getRoom(id) {
        const roomEntry = this.rooms.get(id);
        if (!roomEntry) {
            return {};
        }
        return {
            name: roomEntry.name,
            users: roomEntry.users.reduce((acc, item) => [...acc, { nick: item.nick }], []),
        };
    }
}
exports.ClientService = ClientService;
