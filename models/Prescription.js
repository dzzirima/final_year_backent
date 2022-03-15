import mongoose from 'mongoose'


const PrescriptionSchema = new mongoose.Schema({
    recordId:{
        type:String,
        required:[true,"Please provide recordId"]
    },
    patientId:{
        type:String,
        required:[true,"Please provide the patientId"]
    },
    phamasistId:{
        type:String,

    },
    doctorId:{
        type:String,
        required:[true,"Please provide the doctorsId"]
    },
    quantityPrescribed:{
        type:Number,
    },
    drugDescription:{
        type:String,
    },
    drugImageURL:String,
    accessors:{
        type:Array
    }
},{timestamps:true});

const Prescription = mongoose.model("Prescription",PrescriptionSchema)

export default Prescription