import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    name : {type : String, required : true}
})

const Image = mongoose.models.Image || mongoose.model('Image',ImageSchema)

export default Image;