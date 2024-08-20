import express from 'express'
import { CreateTask,UpdateTask,DeleteTask,GetTask} from '../controller/task'
import { AuthCheck } from '../Middleware/AuthCheck'

const TaskRouter=express.Router()

TaskRouter.post('/',AuthCheck,CreateTask)
TaskRouter.put('/',AuthCheck,UpdateTask)
TaskRouter.delete('/:id',AuthCheck,DeleteTask)
TaskRouter.get('/',AuthCheck,GetTask)

export default TaskRouter