import { Request, Response, NextFunction } from "express";

export default function errorHandlerMiddleware(err, req: Request, res: Response, next: NextFunction) {
    if(err.type === 'bad_request'){
        return res.status(400).send(err.message)
    }
    if(err.type === 'unauthorized'){
        return res.status(401).send(err.message)
    }
    if(err.type === 'not_found'){
        return res.status(404).send(err.message)
    }
    if(err.type === 'conflict'){
        return res.status(409).send(err.message)
    }
}