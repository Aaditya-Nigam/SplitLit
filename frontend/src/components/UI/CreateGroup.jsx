import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore"
import { HiOutlineUserAdd } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import toast, { Toaster } from "react-hot-toast";
import { useGroupStore } from "../../store/useGroupStore";

export const CreateGroup=({showCreateGroup,setShowCreateGroup})=>{

    const {authUser}=useAuthStore()
    const {createGroup}=useGroupStore()
    const [member,setMember]=useState("");
    const [showAdd,setShowAdd]=useState(false);
    const [groupData,setGroupData]=useState({
        groupName: "",
        description: "",
        members: [authUser?.userName]
    })
    const {addParticipant}=useAuthStore()

    const handleAddMember=async (e)=>{
        e.preventDefault();
        if(member.trim().length==0){
            toast.error("Member name cannot be empty!!");
            return ;
        }
        const add=await addParticipant({userName: member})
        if(add!=""){
            if(!groupData.members.includes(add.name)){
                setGroupData({...groupData, members: [...groupData.members,add.name]});
            }
            setMember("");
            setShowAdd(false)
        }else{
            setMember("");
        }
    }
    const handleButton=(e)=>{
        e.preventDefault();
        setShowAdd(true)
    }

    const checkForm=()=>{
        if(groupData.groupName.trim().length==0){
            toast.error("Group name cannot be empty!!")
            return false;
        }
        if(groupData.members.length<=1){
            toast.error("Add more members!")
            return false;
        }
        return true;
    }

    const handleCreateGroup=async (e)=>{
        e.preventDefault();
        const check=checkForm();
        if(check){
            const add=await createGroup(groupData)
            if(add){
                setGroupData({
                    groupName: "",
                    description: "",
                    members: [authUser.userName]
                })
                setShowCreateGroup(false)
            }
        }
    }

    return (
        <>
            <div className={`w-full h-full bg-[#00000099] backdrop-blur fixed top-0 text-white flex justify-center items-center ${showCreateGroup?'':'hidden'}`} onClick={()=> setShowCreateGroup(false)}> 
                <div className="w-[600px] rounded py-4 px-8 bg-[#0d0f1c] border border-[#ffffff10] text-white" onClick={(e)=> e.stopPropagation()}>
                    <div className="pb-8">
                        <p className="text-center text-3xl">Create Group</p>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handleCreateGroup}>
                        <div className="grid grid-cols-[1fr_4fr] gap-1">
                            <label htmlFor="groupName" className="text-lg">Group Name</label>
                            <input type="text" name="groupName" id="groupName" value={groupData.groupName} onChange={(e)=> setGroupData({...groupData, [e.target.name]: e.target.value})} placeholder="Enter group name..." className="border-1 border-[#ffffff67] w-full rounded outline-none px-1 py-0.5 text-sm"/>
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-2">
                            <label htmlFor="description" className="text-lg">Description</label>
                            <input type="text" name="description" id="description" value={groupData.description} onChange={(e)=> setGroupData({...groupData, [e.target.name]: e.target.value})} placeholder="Enter description (optional)..." className="border-1 border-[#ffffff67] w-full rounded outline-none px-1 py-0.5 text-sm"/>
                        </div>
                        <div>
                            <p>Members</p>
                            <div className="flex gap-4 flex-wrap">
                                {
                                    groupData.members.map((ele,idx)=>{
                                        return <p key={idx} className="bg-[#ffffff20] px-4 rounded py-0.5">{ele}</p>
                                    })
                                }
                                <div className="relative">
                                    <button className="flex gap-2 items-center rounded px-2 bg-white text-black cursor-pointer" onClick={handleButton}><HiOutlineUserAdd/>Add Member</button>
                                    <div className={`bg-white w-[350px] p-4 absolute mt-1 left-5 rounded flex gap-2 pt-6 ${showAdd?'':'hidden'}`}>
                                        <RxCross2 className="text-black absolute top-1 right-2 cursor-pointer" onClick={()=> setShowAdd(false)}/>
                                        <input type="text" name="addMember" id="addMember" placeholder="Aaditya_Nigam" value={member} onChange={(e)=> setMember(e.target.value)} className="text-black px-1 border-2 border-black rounded-lg w-full"/>
                                        <button className="text-black bg-gray-400 px-2 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white" onClick={handleAddMember}>Add</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div>
                            <p className="text-orange-300 mb-2"># Add at least one other person to the group</p>
                            <input type="submit" value="Create Group" className="bg-sky-500 rounded py-1 text-lg w-full cursor-pointer hover:bg-sky-600"/>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster/>
        </>
    )
}