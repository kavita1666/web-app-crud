const mongoose= require('mongoose');
const keys= require('../config/keys').mongoUrl;

mongoose.connect(keys,{useNewUrlParser:true})
.then(()=> {
    console.log('database connected');
})
.catch(err=>{
    console.log(err);
})

const modelSchema= mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }

});

module.exports= mongoose.model('User',modelSchema);