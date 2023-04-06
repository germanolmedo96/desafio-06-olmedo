import mongoose from "mongoose";

const collection = 'users';

const schema = new mongoose.Schema({
    first_name:{
        type:String,
        required:false
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        required:false,
        unique:true
    },
    age:{
        type:Number,
    },
    password:{
        type:String,
        required:false
    },
    rol:{
        type:String,
        default:"user"
    }
})

const userModel = mongoose.model(collection,schema);

export default userModel;