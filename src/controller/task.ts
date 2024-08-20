import { TaskInstance } from "../model/task";
import { Response } from "express"
import { AuthenticatedRequest } from "../Middleware/AuthCheck";

interface CreateTaskObject{
    title:string,
    description:string,
    status:string,
    due_date:string
}
interface UpdateTaskObject{
    task_id:number
}
interface DeleteTaskObject{
    id:number
}
export const CreateTask=async(req:AuthenticatedRequest,res:Response)=>{

    const IsValid=await CheckCreateTaskObject(req.body);

    if(IsValid.valid)
    {

        try{
            await TaskInstance.create({
                user_id:Number(req.userId),
                title:req.body.title,
                description:req.body.description,
                status:'new',
                due_date:req.body.due_date
            })
        
            res.status(200).json({msg:'Successfully created task'})
        
          }catch(err)
          {
            res.status(200).json({msg:'Eeatingrror on creating taks'})
          }

    }
    else{
        res.status(500).json({msg:IsValid.message})
    }


 

   

}
export const UpdateTask=async(req:AuthenticatedRequest,res:Response)=>{

   

    const Isvalid=await CheckUpdateObject(req.body,Number(req.userId))
    if(Isvalid.valid)
    { 

        let UpdateObj={} as CreateTaskObject;
        if(req.body.status!==undefined && req.body.status!==null && req.body.status!=='' )
        {
            UpdateObj['status']=req.body.status
        }
        if(req.body.title!==undefined && req.body.title!==null && req.body.title!=='' )
        {
            UpdateObj['title']=req.body.title
        }
        if(req.body.description!==undefined && req.body.description!==null && req.body.description!=='' )
        {
           UpdateObj['description']=req.body.description
        }
        if(req.body.due_date!==undefined && req.body.due_date!==null && req.body.due_date!=='' )
        {
               UpdateObj['due_date']=req.body.due_date
        }
        await TaskInstance.update(UpdateObj,{
            where:{
                id:req.body.task_id
            }
        })

        res.status(200).json({msg:'Succesffully Updated the task'})
 
    }
    else{
        res.status(500).json({msg:Isvalid.message})
    }


}
export const DeleteTask=async(req:AuthenticatedRequest,res:Response)=>{

    const taskId =  { id: Number(req.params.id) };
  
    const IsValid=await CheckDeleteAccess(taskId,Number(req.userId))
    if(IsValid.valid)
    {

        try{
            await TaskInstance.destroy({
                where:{
                    id:taskId.id
                }
            })
            res.status(200).json({msg:'Sucessfully deleted the task'})
            
        }catch(err)
        {
            res.status(500).json({msg:'Erron on deleting task'})
        }

       

    }
    else{
        res.status(500).json({msg:IsValid.message})
    }
    

}
export const GetTask=async(req:AuthenticatedRequest,res:Response)=>{
 

    let offset = parseInt(req.query.offset as string)
    ? parseInt(req.query.offset as string)
    : undefined;
  const limit = parseInt(req.query.limit as string) ? parseInt(req.query.limit as string) : undefined;
  offset = (offset as number - 1) * Number(limit) ;

  if (offset >= 0) {
    offset = offset
  }
  else {
    offset = 0
  }
  
         const sortField = req.query.sortby as string || 'createdAt';
         const sortOrder = req.query.sortorder as string || 'DESC'; 
         const status = req.query.status as string; 
         const dueDate = req.query.due_date as string;
         const whereCondition: any = { user_id: req.userId };

       if (status) {
           whereCondition.status = status;
       }

       if (dueDate) {
           whereCondition.due_date = dueDate;
       }

       // Perform the query with the options provided or defaults
       const GetTasks = await TaskInstance.findAll({
           where: whereCondition,
           limit: limit,
           offset: offset,
           order: [
               [sortField, sortOrder]
           ]
       });

  

    return res.status(200).json({list:GetTasks})
    
}

async function CheckDeleteAccess(Obj:DeleteTaskObject,UserId:number){

    if (!Obj || typeof Obj !== 'object') {
        return {
            valid: false,
            message: 'Invalid input data'
        };
    }
    if(Obj.id===undefined|| Obj.id===null)
        {
            return {
                valid: false,
                message: 'task_id is required'
            }; 
        }
        const CheckTask=await TaskInstance.findOne({
            where:{
               id:Obj.id
            }
        })
        if(CheckTask===null)
        {
    
            return {
                valid: false,
                message: 'task_id does not exists'
            };
    
        }
        else{
          
            if(CheckTask.dataValues.user_id!==UserId)
            {
    
                return {
                    valid: false,
                    message: 'You dont have permission to delete this task'
                };
    
            }
    
       
        }
    
        return {
            valid: true,
            message: 'Validation successfull'
        }; 

}

async function CheckUpdateObject(Obj:UpdateTaskObject,userId:number)
{

    if (!Obj || typeof Obj !== 'object') {
        return {
            valid: false,
            message: 'Invalid input data'
        };
    }
    if(Obj.task_id===undefined|| Obj.task_id===null)
    {
        return {
            valid: false,
            message: 'task_id is required'
        }; 
    }

    const CheckTask=await TaskInstance.findOne({
        where:{
           id:Obj.task_id
        }
    })
    if(CheckTask===null)
    {

        return {
            valid: false,
            message: 'task_id does not exists'
        };

    }
    else{
      
        if(CheckTask.dataValues.user_id!==userId)
        {

            return {
                valid: false,
                message: 'You dont have permission to update this task'
            };

        }

   
    }

    return {
        valid: true,
        message: 'Validation successfull'
    }; 

   


}


async function CheckCreateTaskObject(Obj:CreateTaskObject){
  
    if (!Obj || typeof Obj !== 'object') {
        return {
            valid: false,
            message: 'Invalid input data'
        };
    }

    if (Obj.title === undefined || Obj.title === null || Obj.title === '') {
        return {
            valid: false,
            message: 'title is required'
        };
    }
    if (Obj.description === undefined || Obj.description === null || Obj.description === '') {
        return {
            valid: false,
            message: 'description is required'
        };
    }
    if (Obj.due_date === undefined || Obj.due_date === null || Obj.due_date === '') {
        return {
            valid: false,
            message: 'due_date is required'
        };
    }

    return {
        valid: true,
        message: 'Validation successful'
    };

}