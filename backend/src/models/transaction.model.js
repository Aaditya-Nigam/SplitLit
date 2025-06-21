const mongoose=require("mongoose")

const transactionSchema=new mongoose.Schema({
    member1: {
        type: String,
        required: true
    },
    member2: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    isGroupTransaction: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    groupName: {
        type: String,
        default: null
    }
})

const Transaction=new mongoose.model('Transaction', transactionSchema)
module.exports=Transaction