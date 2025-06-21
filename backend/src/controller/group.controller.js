const User = require("../models/auth.model");
const Group=require("../models/group.model")

const getAllGroups=async (req,res)=>{
    try {
        const userName=req.user.userName
        const group=await Group.find({members: userName});
        res.status(201).json(group);
    } catch (error) {
        console.log("Error in getAllGroups controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const getGroup=async (req,res)=>{
    try {
        const {groupId}=req.body;
        if(!groupId){
            res.status(401).json({message: "Fields are missing!"})
            return ;
        }
        const group=await Group.findById(groupId);
        if(!group){
            res.status(401).json({message: "Invalid groupId!"});
            return ;
        }
        res.status(201).json(group);
    } catch (error) {
        console.log("Error in getAllGroups controller: ",error.message);
        res.status(401).json({message: "Internal server error!"});
    }
}

const createGroup=async (req,res)=>{
    try {
        const userId=req.user._id;
        const {groupName,description,members}=req.body;
        if(!groupName || !members){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const newGroup=new Group({
            author: userId,
            groupName,
            description,
            members
        })
        await newGroup.save();
        members.map(async (ele)=>{
            await User.updateOne({userName: ele}, {$push: {groups: newGroup._id}});
        })
        res.status(201).json(newGroup)
    } catch (error) {
        console.log("Error in createGroup controller: ",error)
        res.status(401).json({message: "Internal serverc error!"});
    }
}

const deleteGroup=async (req,res)=>{
    try {
        const {groupId}=req.body;
        if(!groupId){
            res.status(401).json({message: "Fields are missing!"});
            return ;
        }
        const group=await Group.findById(groupId)
        if(!group){
            res.status(401).json({message: "No such group exists!"});
            return ;
        }
        group.members.map(async (id)=>{
            await User.findByIdAndUpdate(id, {$pull: {groups: groupId}});
        })
        const deletedGroup=await Group.findByIdAndDelete(groupId);
        res.status(201).json(deletedGroup)
    } catch (error) {
        console.log("Error in deleteGroup controller: ",error.message)
        res.status(401).json({message: "Internal server error!"});
    }
}

module.exports={
    getAllGroups,
    createGroup,
    deleteGroup,
    getGroup
}