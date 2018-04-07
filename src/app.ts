import * as express from "express";
import  {Express, NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import {ClientService} from "./connectionService";

const PORT = 3000;

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    next();
});

const httpServer: http.Server = app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

new ClientService(app, httpServer);
