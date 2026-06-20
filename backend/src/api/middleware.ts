import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./routes/auth";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        const Bearertoken = req.headers.authorization;
        if (!Bearertoken) {
            res.status(401).send({
                msg: "You are not logged in"
            })
            return;
        }
        const token = Bearertoken.split(" ")[1];

        const decodedToken = jwt.verify(token, JWT_SECRET) as {userId : string};
        req.userId = decodedToken.userId;

        next();
    } catch (e) {
        res.status(401).send({
            msg : "Unauthorized access"
        })
    }

}