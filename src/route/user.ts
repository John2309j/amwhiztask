import express from 'express'
import {CreateUser,LoginUser,Logout} from '../controller/user';
 

const UserRouter=express.Router();

UserRouter.post('/register',CreateUser)
UserRouter.post('/login',LoginUser)
UserRouter.post('/logout',Logout)

export default UserRouter