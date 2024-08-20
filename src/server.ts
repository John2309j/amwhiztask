import express,{Request,Response} from 'express'
import { rateLimit } from 'express-rate-limit'
import db from './config/database.config';
import SyncModels from './model';
import UserRouter from './route/user';
import TaskRouter from './route/task';


const app=express();

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 100, // Limit each IP to 5 requests per `window` (here, per 1 minute).
	standardHeaders: true, 
	legacyHeaders: false
});
app.use(limiter)

db.sync().then(()=>{
    SyncModels()
}).catch((err)=>{
    console.log('Error Connecting database',err)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.use('/user',UserRouter)
app.use('/task',TaskRouter)

app.get('/',(req:Request,res:Response)=>{

res.status(200).json({msg:'App Running'})

})

app.listen(5000,()=>{
console.log('app running')
})