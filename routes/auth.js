import express from 'express'
const Router = express.Router()
import {register ,login, updateUser, deleteUser, getUser, getAllUsers, forgetPassword, resetPassword} from '../controllers/auth.js'
import {verify_user} from '../middleware/auth.js'
import { authRole } from '../middleware/authRoles.js'
import { ROLES } from '../util/Roles.js'


Router.route('/register').post(register)
Router.route('/login').post(login)
Router.route('/update').put(updateUser)
Router.route('/getUser').get(getUser)

Router.route('/forgotPassword').post(forgetPassword)
Router.route('/resetPassword').post(resetPassword)

// only the admin can do this
Router.route('/getAllUsers').get( getAllUsers)
Router.route('/delete').delete(verify_user,authRole(ROLES.ADMIN), deleteUser)










export default Router
