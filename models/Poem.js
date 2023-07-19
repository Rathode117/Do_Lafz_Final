const mongoose=require ('mongoose');
const Schema = mongoose.Schema;

const poemSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required:true
    },
    poem:{
        type: String,
        required: true
    },
    poememail:{
        type: String,
        required:true
    }
    


}, {timestamps: true});

const Poem = mongoose.model('Poem', poemSchema); //if name of collection is plural of poem i.e., Poems
module.exports=Poem;