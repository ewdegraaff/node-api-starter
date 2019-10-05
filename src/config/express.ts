import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import { Express } from "express";

import logger from "util/logger";
import passport from "config/passport";
import { APP_PORT } from "config/settings";
import { CORS } from "config/secrets";

export default (app: Express): void => {
    app.set("port", APP_PORT);

    const corsOptions = {
        origin: function (origin: string, callback: Function): void {
            if (!origin) return callback();
            let match = false;
            if (origin.match(new RegExp(CORS))) match = true;
            callback(null, match);
        }
    };

    passport(app);
    
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compression());
    app.use(morgan("[:method] :url :status :res[content-length] - :response-time ms", { "stream": {
        write: (text: string): void => {
            logger.info(text.substring(0, text.lastIndexOf("\n")));
        }
    }}));
};
