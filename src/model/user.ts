import { DataTypes, Model } from "sequelize";
import db from "../config/database.config";

interface UserAttributes{
    id?:number,
    name:string,
    email:string,
    password:string,
    token?:string | null
}

export class UserInstance extends Model<UserAttributes>{}

UserInstance.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.TEXT("long"),
            allowNull:false
        },
        token:{
            type:DataTypes.TEXT("long"),  
        }
    },
    {
        sequelize:db,
        tableName:'users'
    }
)