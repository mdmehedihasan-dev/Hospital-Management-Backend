import express from 'express'
import { appointmentDelete, appointmentUpdate, getAllAppointment, postAppointment } from '../controller/appointmentController.js'
import { isAdminAuthenticated, isPatientAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/post', isPatientAuthenticated, postAppointment)
router.get('/getall',isAdminAuthenticated, getAllAppointment)
router.put('/update/:id',isAdminAuthenticated, appointmentUpdate)
router.delete('/delete/:id',isAdminAuthenticated, appointmentDelete)

export default router