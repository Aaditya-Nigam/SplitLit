const mongoose=require("mongoose")

const groupSchema=mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    description: {
        type: String,
        default: "Group name"
    }
},{timestamps: true})

const Group=mongoose.model('Group',groupSchema)
module.exports=Group