
import { NextFunction,Request,Response } from "express";
import Jwt,{JwtPayload} from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
    userId?: number;
    email?: string;
    name?: string;
}
export const AuthCheck=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

   const Token=req.headers.authorization;
   if(Token===undefined || Token===null || Token==='')
   {
    res.status(401).json({msg:'Unauthorized'})
   }
   else{

    Jwt.verify(Token, 'amwhizEncrypt', (err, decoded) => {
                if (err) 
                    {
                        return res.status(401).json({msg:'Invalid/Expired Token'});
                    }
                    else{

                     
                       
                        req.userId = (decoded as JwtPayload).data.id;
                        req.name = (decoded as JwtPayload).data.name;
                        req.email = (decoded as JwtPayload).data.email;
                        next();
                       
                    }
             
              
            })

   }
   


}