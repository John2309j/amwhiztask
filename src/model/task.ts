import { DataTypes, Model } from "sequelize";
import db from "../config/database.config";

interface TaskAttributes{
    id?:number,
    user_id:number,
    title:string,
    description:string,
    status:string,
    due_date:string
}

export class TaskInstance extends Model<TaskAttributes>{}

TaskInstance.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        user_id:{
            type:DataTypes.INTEGER,
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT("long"),
            allowNull:false
        },
        status:{
            type:DataTypes.STRING, 
            allowNull:false 
        },
        due_date:{
            type:DataTypes.STRING, 
            allowNull:false 
        }
    },
    {
        sequelize:db,
        tableName:'tasks'
    }
)