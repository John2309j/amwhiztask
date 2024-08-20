import { Request,Response } from "express"
import bcrypt from "bcrypt";
import { UserInstance } from "../model/user"
import  Jwt, { decode }  from "jsonwebtoken";

interface LoginObject {
    email: string;
    password: string;
}
interface CreateUserObject {
    name:string;
    email: string;
    password: string;
}
export const CreateUser=async(req:Request,res:Response)=>{ 

 
    const Isvalid = await ValidateCreateUserObject(req.body)

    if(Isvalid.valid)
    {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        try{
            const CreateUser=await UserInstance.create({
                name:req.body.name,
                email:req.body.email,
                password:hashedPassword
            })
            res.status(200).json({msg:'Successfully created an user'})
        }
        catch(err)
        {
            console.log(err)
            res.status(500).json({msg:'Error on creating the user'})
        }
        
    }
    else{
        res.status(500).json({msg:Isvalid.message})
    }



}

export const LoginUser=async(req:Request,res:Response)=>{

    const Isvalid = await ValidaLoginObject(req.body)

    if(Isvalid.valid)
    {

       

        const UserDetails=await UserInstance.findOne({
            where:{
                email:req.body.email
            }
        })

        if (UserDetails) {
            const password: string | undefined = UserDetails.get('password') as string;
            if (password) {
              const isMatch: boolean = await bcrypt.compare(req.body.password, password);
              if(isMatch)
              {

                const Token=Jwt.sign({
                    data: UserDetails
                  }, 'amwhizEncrypt', { expiresIn: 60 * 60 });

                await UserInstance.update({
                    token:Token
                },{
                    where:{
                        email:req.body.email
                    }
                })

                res.status(200).json({
                    token:Token,
                    msg:'login successfull'
                })

             
              
              }
              else{
                res.status(500).json({msg:'Invalid Login'})
              }
            
            }
        }
          
      



 
        

    }
    else{
        res.status(500).json({msg:Isvalid.message}) 
    }

}

export const Logout=async(req:Request,res:Response)=>{

    const Headers=req.headers.authorization as string
    if(Headers===undefined || Headers==='' || Headers===null)
    {
        res.status(500).json({msg:'Token is required'}) 
     
    }
    else{
      
         interface UserObject{
            name?:string,
            email?:string
           
          
         }
           let Uservalid:UserObject={};


          Jwt.verify(Headers, 'amwhizEncrypt',  async function(err, decoded:any) {
            if (err) {

                res.status(500).json({msg:'Invalid/Expired token'})
             
            }
            if(decoded)
            {
                
                Uservalid=decoded.data
               
                await UserInstance.update({
                    token:null
                },{
                    where:{
                        email:Uservalid.email
                    }
                })
            

                res.status(200).json({msg:'logout successfull'})
            
            }
          });

         


    }
  

}



async function ValidaLoginObject(Obj:LoginObject)
{
    if (!Obj || typeof Obj !== 'object') {
        return {
            valid: false,
            message: 'Invalid input data'
        };
    }

    if (Obj.email === undefined || Obj.email === null || Obj.email === '') {
        return {
            valid: false,
            message: 'Email is required'
        };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Obj.email)) {
        return {
            valid: false,
            message: 'Invalid email format'
        };
    }

    
    if (Obj.password === undefined || Obj.password === null || Obj.password === '') {
        return {
            valid: false,
            message: 'Password is required'
        };
    }

    const CheckUserExists=await UserInstance.count({
        where:{
            email:Obj.email
        }
    })

    if(CheckUserExists===0)
    {

        return {
            valid: false,
            message: 'User with this email does not exist in the system'
        };

    }

    
    return {
        valid: true,
        message: 'Validation successful'
    };

 
}

async function ValidateCreateUserObject(Obj: CreateUserObject) {
    if (!Obj || typeof Obj !== 'object') {
        return {
            valid: false,
            message: 'Invalid input data'
        };
    }

    if (Obj.name === undefined || Obj.name === null || Obj.name === '') {
        return {
            valid: false,
            message: 'Name is required'
        };
    }

    if (Obj.email === undefined || Obj.email === null || Obj.email === '') {
        return {
            valid: false,
            message: 'Email is required'
        };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Obj.email)) {
        return {
            valid: false,
            message: 'Invalid email format'
        };
    }

    if (Obj.password === undefined || Obj.password === null || Obj.password === '') {
        return {
            valid: false,
            message: 'Password is required'
        };
    }

    const CheckUserExists=await UserInstance.count({
        where:{
            email:Obj.email
        }
    })
    if(CheckUserExists!==0)
    {
        return {
            valid: false,
            message: 'User account already exists'
        };  
    }

    return {
        valid: true,
        message: 'Validation successful'
    };
}
