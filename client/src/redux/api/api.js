import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({baseUrl:`${server}/api/v1`}),
    tagTypes : ["Chat", "User","Message","DashboardStats","DashboardUsers","DashboardChats"],
    endpoints : (builder)=> ({
        myChats : builder.query({
            query : () =>({
                url : "/chat/getChats",
                credentials : "include"
            }),
            providesTags : ["Chat"]
        }),
        searchUser : builder.query({
            query: (name) => ({
                url : `/user/search?name=${name}`,
                credentials : "include"
            }),
            providesTags : ["User"]
        }),
        sendFriendRequest : builder.mutation({
            query : (data)=>({
                url : "/user/sendrequest",
                method : "PUT",
                credentials : "include",
                body : data
            }),
            invalidatesTags : ["User"]
        }),
        getNotifications : builder.query({
            query: () => ({
                url : "/user/notifications",
                credentials : "include"
            }),
            keepUnusedDataFor : 0
        }),
        acceptFriendRequest : builder.mutation({
            query : (data)=>({
                url : "/user/acceptrequest",
                method : "PUT",
                credentials : "include",
                body : data
            }),
            invalidatesTags : ["Chat"]
        }),
        chatDetails : builder.query({
            query: ({chatId,populate=false}) => {
                let url = `/chat/${chatId}`;
                if(populate){
                    url += "?populate=true"
                }
                return {
                    url : url,
                    credentials : "include"
                }
            },
            providesTags :['Chat']
        }),
        getMessages : builder.query({
            query: ({chatId,page}) => ({
                url : `/chat/message/${chatId}?page=${page}`,
                credentials : "include"
            }),
            keepUnusedDataFor : 0
        }),
        sendAttachments : builder.mutation({
            query : (data)=>({
                url : "/chat/message",
                method : "POST",
                credentials : "include",
                body : data
            }),
        }),
        myGroups : builder.query({
            query: () => ({
                url : `/chat/getGroups`,
                credentials : "include"
            }),
            providesTags : ["Chat"]
        }),
        availableFriends : builder.query({
            query: (chatId) => {
                let url = `/user/friends`;
                if(chatId){
                    url += `?chatId=${chatId}`
                }
                return {
                    url : url,
                    credentials : "include"
                }
            },
            providesTags :['Chat']
        }),
        newGroup : builder.mutation({
            query : ({groupName,groupMembers})=>({
                url : "/chat/newChat",
                method : "POST",
                credentials : "include",
                body : {groupName,groupMembers}
            }),
            invalidatesTags : ["Chat"]
        }),
        renameGroup : builder.mutation({
            query : ({chatId,name})=>({
                url : `/chat/${chatId}`,
                method : "PUT",
                credentials : "include",
                body : {name}
            }),
            invalidatesTags : ["Chat"]
        }),
        removeGroupMember : builder.mutation({
            query : ({chatId,userId})=>({
                url : `/chat/removeMember`,
                method : "PUT",
                credentials : "include",
                body : {chatId,userId}
            }),
            invalidatesTags : ["Chat"]
        }),
        addGroupMembers : builder.mutation({
            query : ({chatId,members})=>({
                url : `/chat/addMembers`,
                method : "PUT",
                credentials : "include",
                body : {chatId,members}
            }),
            invalidatesTags : ["Chat"]
        }),
        deleteChat : builder.mutation({
            query : (chatId)=>({
                url : `/chat/${chatId}`,
                method : "DELETE",
                credentials : "include",
            }),
            invalidatesTags : ["Chat"]
        }),
        leaveGroup : builder.mutation({
            query : (chatId)=>({
                url : `/chat/leave/${chatId}`,
                method : "DELETE",
                credentials : "include",
            }),
            invalidatesTags : ["Chat"]
        }),
        dashboardStats : builder.query({
            query: () => ({
                url : `/admin/dashboard`,
                credentials : "include"
            }),
            providesTags : ["DashboardStats"]
        }),
        adminAllUsers : builder.query({
            query: () => ({
                url : `/admin/users`,
                credentials : "include"
            }),
            providesTags : ["DashboardUsers"]
        }),
        adminAllChats : builder.query({
            query: () => ({
                url : `/admin/chats`,
                credentials : "include"
            }),
            providesTags : ["DashboardChats"]
        }),
        adminAllMessages : builder.query({
            query: () => ({
                url : `/admin/messages`,
                credentials : "include"
            }),
            providesTags : ["DashboardChats"]
        }),
    }),
});

export default api;
export const{
    useMyChatsQuery, 
    useLazySearchUserQuery, 
    useSendFriendRequestMutation, 
    useGetNotificationsQuery, 
    useAcceptFriendRequestMutation, 
    useChatDetailsQuery, 
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMembersMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
    useDashboardStatsQuery,
    useAdminAllUsersQuery,
    useAdminAllChatsQuery,
    useAdminAllMessagesQuery
} = api;