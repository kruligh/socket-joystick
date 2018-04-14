import serveStatic = require("serve-static");

require('console-stamp')(console, '[HH:MM:ss.l]');
import * as express from "express";
import {Express, NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import {ClientService} from "./connectionService";

const path = require('path');

//todo move this to parms or env or whatever
const PORT = 3000;
const STATIC_DIR = path.resolve(`${__dirname}/../app`); // path.resolve changes .. to full absolute path

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(req); // uncomment for debugging
    next();
});

const httpServer: http.Server = app.listen(PORT, () => {
    console.log("Server started on port " + PORT + " serves static from " + STATIC_DIR);
});

// ----------------- serve socket server and api
const clientService = new ClientService(app, httpServer);

app.get('/room/:roomId', (req: Request, res: Response, next: Function) => {
    res.status(200).json({
        status: 'success',
        data: clientService.getRoom(req.params.roomId),
    });
    next();
});

// ----------------- serve statics explicit
app.get('', function (req, res) {
    res.sendFile(`${STATIC_DIR}/index.html`);
});

app.get('/host', function (req, res) {
    res.sendFile(`${STATIC_DIR}/host.html`);
});

app.get('/client', function (req, res) {
    res.sendFile(`${STATIC_DIR}/client.html`);
});

app.use('/resource', serveStatic(`${STATIC_DIR}/resource`));
