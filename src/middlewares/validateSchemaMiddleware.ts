import { Request, Response, NextFunction } from "express";

export default function validateSchemaMiddleware(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => { 
      const validation = schema.validate(req.body);
      if (validation.error) {
        throw ("revise os dados enviados");
      }
      
      next();
    }
  }