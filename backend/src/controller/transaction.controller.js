const Transaction=require('../models/transaction.model')

const getAllTransaction=async (req,res)=>{
    try {
        const userName=req.user.userName;
        const transactions=await Transaction.find({
            $or: [
                {member1: userName},
                {member2: userName}
            ]
        })
        res.status(201).json(transactions);
    } catch (error) {
        console.log("Error in getAllTransaction controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const getTransaction=async (req,res)=>{
    try {
        const {userName}=req.body
        const user=req.user.userName
        if(!userName){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const transaction=await Transaction.findOne({
            $or: [{member1: userName, member2: user, isGroupTransaction: false},
                {member1: user, member2: userName, isGroupTransaction: false}
            ]
        })
        res.status(201).json(transaction)
    } catch (error) {
        console.log("Error in getTransaction controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const getGroupTransaction=async (req,res)=>{
    try {
        const {groupId}=req.body
        const user=req.user.userName
        if(!groupId){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const transaction=await Transaction.find({
            $or: [{member1: user, isGroupTransaction: true, groupId},
                {member2: user, isGroupTransaction: true, groupId}
            ]
        })
        res.status(201).json(transaction)
    } catch (error) {
        console.log("Error in getGroupTransaction controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

module.exports={
    getAllTransaction,
    getTransaction,
    getGroupTransaction
}