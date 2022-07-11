import mongoose from 'mongoose';

const dbConnect = async  () =>{
    await mongoose.connect(process.env.MONGOURLG)
        // .then((result) => console.log(result))
    console.log("Connected to the DB")

}

export default dbConnect


