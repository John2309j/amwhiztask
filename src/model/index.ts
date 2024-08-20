import { UserInstance } from "./user";
import { TaskInstance } from "./task";
import db from "../config/database.config";

const SyncModels=()=>{
    UserInstance.sync({alter:true})
    TaskInstance.sync({alter:true})
}
export default SyncModels