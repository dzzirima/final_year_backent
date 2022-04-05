import express from 'express'
import { grantAcess, revokeAccess } from '../controllers/accessors.js'
const Router = express.Router()

import {verify_user} from '../middleware/auth.js'



Router.route('/grantAccess').post(grantAcess)
Router.route('/revokeAccess').post( revokeAccess)


export default Router
