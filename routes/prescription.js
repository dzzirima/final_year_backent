import express from 'express'
import { createRecord, deleteRecord, getAllUserRecords, getRecord, updateRecord } from '../controllers/Prescription.js'
const Router = express.Router()

import {verify_user} from '../middleware/auth.js'
import { authRole } from '../middleware/authRoles.js'
import { ROLES } from '../util/Roles.js'


Router.route('/createRecord').post(createRecord)
Router.route('/updateRecord').post(updateRecord)

/**The patient should delete their records */
Router.route('/deleteRecord').delete(verify_user, deleteRecord)
Router.route('/getRecord').get(getRecord)

/**A user or a doctor can get the  records  */
Router.route('/getAllUserRecords').get(verify_user, getAllUserRecords)


// only the admin can do this












export default Router