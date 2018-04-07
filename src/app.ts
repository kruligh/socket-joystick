import * as express from "express";
import {Express, NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import {ClientService} from "./connectionService";

const PORT = 3000;
const debug = true;

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log(req);
    next();
});

const httpServer: http.Server = app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

const clientService = new ClientService(app, httpServer);

const debugRouter = express.Router();

debugRouter.use((req: Request, res: Response, next: NextFunction) => {
    if (debug) {
        next();
    } else {
        res.status(403).json({
            status: 'forbidden',
            data: 'debug mode is off'
        });
    }
});

debugRouter.get('/room/:roomId', (req: Request, res: Response, next: Function) => {
    res.status(200).json({
        status: 'success',
        data: clientService.getRoom(req.params.roomId),
    });
    next();
});

app.use('/debug', debugRouter);