"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { Fragment, useMemo, useState,useCallback } from "react";
import {Dialog, Transition} from "@headlessui/react";
import {IoClose, IoTrash} from "react-icons/io5";
import Avatar from "@/app/components/Avatar";
import Modal from "@/app/components/Modal";
import {FiAlertTriangle} from "react-icons/fi";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface ProfileDrawerProps {
    isOpen:boolean;
    onClose:()=>void;
    data:Conversation & {
        users: User[]
    }
}
const ProfileDrawer:React.FC<ProfileDrawerProps>=({
    isOpen, onClose,data
})=>{
    const router=useRouter();
    const {conversationId}=useConversation();
    const [isLoading, setIsLoading] = useState(false);
    const otherUser=useOtherUser(data);
    const [isModalOpen, setIsModalOpen]=useState(false);
    const { members}=useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;
    const onDelete = useCallback(()=>{
        setIsLoading(true);
        axios.delete(`/api/conversations/${conversationId}`)
        .then(()=>{
            onClose();
            router.push('/conversations');
            router.refresh();
        })
        .catch(()=>toast.error('Something went wrong!'))
        .finally(()=>setIsLoading(false))
    },[conversationId, router,onClose]);
    const joinedDate=useMemo(()=>{
        return format(new Date(otherUser.createdAt),'PP');
    },[otherUser.createdAt]);
    const title=useMemo(()=>{
        return data.name || otherUser.name;
    },[data.name,otherUser.name]);
    const statusText = useMemo(()=>{
        if(data.isGroup){
            return `${data.users.length}members`;
        }
        return isActive ? 'Active' : 'Offline';
    },[data,isActive]);
    return (
        <>
        <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} >
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <FiAlertTriangle className="h-6 w-6 text-red-600"/>
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
            Delete Conversation
            </Dialog.Title>
            <div className="mt-2">
            <p className="text-sm text-gray-500">Are you sure you want to delete this conversation? This action cannot be undone. </p>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button disabled={isLoading} danger onClick={onDelete}>
                Delete
            </Button>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button disabled={isLoading} secondary onClick={onClose}>
                Cancel
            </Button>
            </div>
            </div>
            
            </div>

        </Modal>
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child as={Fragment} enter="ease-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed
            inset-0
            bg-black
            bg-opacity-40"
            />
            </Transition.Child>
            <div className="fixed
            inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none
                    fixed
                    inset-y-0
                    right-0
                    flex
                    max-w-full
                    pl-10
                    ">
                        <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveTo="translate-x-full">
                            <Dialog.Panel
                            className="pointer-events-auto w-screen max-w-md"
                            >
                                <div className="flex
                                h-full
                                flex-col
                                overflow-y-scroll
                                bg-white
                                py-6
                                shadow-xl">
                                    <div  className="px-4 sm:px-6">
                                        <div className="flex
                                        items-start
                                        justify-end">
                                            <div className="ml-3 flex h-7 items-center">
                                                <button type="button" onClick={onClose} className="rounded-md
                                                bg-white
                                                text-gray-400
                                                hover:text-gray-500
                                                focus-outline-none
                                                focus:ring-2
                                                focus:ring-sky-500
                                                focus:ring-offset-2">
                                                    <span className="sr-only">Close Panel</span>
                                                    <IoClose size={24}/>
                                                </button>

                                            </div>

                                        </div>


                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        <div className="flex flex-col items-center">
                                            <div className="mb-2">
                                                {data.isGroup ? (
                                                    <AvatarGroup 
                                                    users={data.users}
                                                    />
                                                ):(
                                                    <Avatar user={otherUser}/>
                                                )}
                                                
                                            </div>
                                            <div>
                                                {title}
                                            </div>
                                            <div className="flex-sm text-gray-500">
                                                {statusText}
                                            </div>
                                            <div className="flex gap-10 my-8">
                                                <div onClick={()=>setIsModalOpen(true)}
                                                className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                                                <div  className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                                    <IoTrash size={20}/>

                                                </div>
                                                <div className="text-sm font-light text-neutral-600">
                                                    Delete
                                                </div>
                                                </div>
                                            </div>
                                            <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                <dl  className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                    {data.isGroup && (
                                                        <div>
                                                            <dt className="
                                                            text-sm
                                                            font-medium
                                                            text-gray-500
                                                            sm:w-40
                                                            sm:flex-shrink-0
                                                            ">
                                                                Emails
                                                            </dt>
                                                            <dd className="
                                                            mt-1
                                                            text-sm
                                                            text-gray-900
                                                            sm:col-span-2
                                                            ">
                                                                {data.users.map((user)=>user.email).join(', ')}
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {!data.isGroup && (
                                                        <div>
                                                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                                            Email
                                                            </dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                            {otherUser.email}
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {!data.isGroup && (
                                                        <>
                                                        <hr />
                                                        <div>
                                                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                                            Joined
                                                            </dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                            <time dateTime={joinedDate}>
                                                            {joinedDate}
                                                            </time>
                                                            </dd>
                                                        </div>
                                                        </>
                                                    )}
                                                </dl>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </Dialog.Panel>

                        </Transition.Child>

                    </div>

                </div>

            </div>
            </Dialog>
        </Transition.Root>
        </>
    );
}
export default ProfileDrawer;