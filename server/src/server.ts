require('console-stamp')(console, '[HH:MM:ss.l]');
import * as bodyParser from 'body-parser';
import * as express from 'express';
import {Express, NextFunction, Request, Response} from 'express';
import * as http from 'http';
import {ClientService} from './connectionService';
import {DEFAULT_PORT} from './utils';

const path = require('path');

const PORT = process.env.PORT || DEFAULT_PORT;

const STATIC_DIR = path.resolve(`${__dirname}/../app`); // path.resolve changes .. to full absolute path

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(req); // uncomment for debugging
    next();
});

const httpServer: http.Server = app.listen(PORT, () => {
    console.log('Server started on port ' + PORT + ' serves static from ' + STATIC_DIR);
});

// ----------------- serve socket server and api
const clientService = new ClientService();
clientService.init(app, httpServer);

app.get('/room/:roomId', (req: Request, res: Response, next: () => void) => {
    res.status(200).json({
        data: clientService.getRoom(req.params.roomId),
        status: 'success',
    });
    next();
});
