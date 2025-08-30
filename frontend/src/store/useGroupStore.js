import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore=create((set,get)=>({
    isCreatingGroup: false,
    isLoadingGroups: false,
    groups: [],
    group: null,
    isSearchingGroup: false,

    getAllGroups: async ()=>{
        set({isLoadingGroups: true})
        try {
            const res=await axiosInstance.get("/group/getAllGroups");
            const data=res.data;
            set({groups: data});
        } catch (error) {
            console.log("Error in useGroupStor getAllGroups: ",error)
            toast.error(error.response.data.message)
        }finally{
            set({isLoadingGroups: false});
        }
    },

    getGroup: async (formData)=>{
        set({isSearchingGroup: true})
        try {
            const res=await axiosInstance.get(`/group/getGroup/${formData.groupId}`)
            const data=await res.data;
            set({group: data});
        } catch (error) {
            console.log("Error in getGroup useExpenseStore: ",error)
            toast.error(error.response.data.message)
        }finally{
            set({isSearchingGroup: false});
        }
    },

    createGroup: async (formData)=>{
        set({isCreatingGroup: true});
        try {
            const res=await axiosInstance.post("/group/createGroup",formData)
            const data=res.data;
            console.log(data)
            toast.success("Group created!");
            set({isCreatingGroup: false})
            // const groups=get().groups;
            const authUser = useAuthStore.getState().authUser;

            useAuthStore.setState({
            authUser: {
                ...authUser,
                groups: [...authUser.groups, data]
            }
        });
            // set({groups: [...groups,data]});
            return true;
        } catch (error) {
            console.log("Error in useGroupStore createGroup: ",error)
            toast.error(error.response.data.message)
            set({isCreatingGroup: false})
            return false
        }
    }
}))