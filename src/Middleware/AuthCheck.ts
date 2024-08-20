
import { NextFunction,Request,Response } from "express";
import Jwt,{JwtPayload} from "jsonwebtoken";
import { UserInstance } from "../model/user";


export interface AuthenticatedRequest extends Request {
    userId?: number;
    email?: string;
    name?: string;
}
export const AuthCheck=async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

   const Token=req.headers.authorization;
   if(Token===undefined || Token===null || Token==='')
   {
    res.status(401).json({msg:'Unauthorized'})
   }
   else{

    const CheckTokenExists=await UserInstance.count({
        where:{
            token:Token
        }
    })
    if(CheckTokenExists!==0)
    {

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
    else{
        return res.status(401).json({msg:'Invalid/Expired Token'}); 
    }

  

   }
   


}