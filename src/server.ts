require('console-stamp')(console, '[HH:MM:ss.l]');
import * as express from "express";
import {Express, NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import {ClientService} from "./connectionService";
import * as serveStatic from 'serve-static';

const PORT = 3000;
const STATIC_DIR = `${__dirname}`
const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(req);
    next();
});

app.use(serveStatic(STATIC_DIR, {'index': ['index.html']}));

const httpServer: http.Server = app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

const clientService = new ClientService(app, httpServer);

app.get('/room/:roomId', (req: Request, res: Response, next: Function) => {
    res.status(200).json({
        status: 'success',
        data: clientService.getRoom(req.params.roomId),
    });
    next();
});
