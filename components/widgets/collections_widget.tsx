"use client"
import { Search } from "lucide-react"
import { COLORS } from "@/app/data/standard_data"
import React, { useEffect, useState } from "react"
import FolderCard from "../profile/folder_widget"
import { ManageCollectionData } from "../profile/edit_collection"
import LoadingSpinner from "../animation/loading"
import { Input } from "../ui/input"


//* collection body widget 
export default function CollectionsWidget({userId, collectionsIds}:{userId: string, collectionsIds: string[]}) {
    return (
        <div className="w-full p-2 pt-4">
            <CollectionsDisplay collectionsIds={collectionsIds} userId={userId} />
        </div>
    )
}

//* display user collections 
const CollectionsDisplay = ({ collectionsIds, userId }: { collectionsIds: string[], userId: string }) => {
    //* vars to manage the state
    const [userCollections, setUserCollections] = useState<any[]>([])
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    //* get the user collections from the db based on his ids list
    useEffect(() => {
        const getUserCollectionsDataFromDb = async () => {
            const response = await fetch(`/api/connection/collections?ids=${collectionsIds}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                  },
            })

            //* if the result is ok 
            if (response.ok) {
                const data = await response.json();
                //* update the search and original list
                setUserCollections(data.collections ?? [])
                setSearchResult(data.collections ?? [])
            }

            //* stop loading
            setIsLoading(false)
        }
        getUserCollectionsDataFromDb()
    }, [])



    //* get the corresponding color to the key 
    const getTheBgColorForTheCollectionFromTheMapList = (key: string) => {
        const colorForTheCard = COLORS.find((colorItem) => colorItem.label === key)
        return colorForTheCard? colorForTheCard.color : "bg-white"
    }



        //* update the search term
        const updateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
            if (e.target.value === "") {
                // just so it display all items in case empty search
                setSearchResult(userCollections)
            } else {
                const newList = userCollections.filter((collection) => collection.title.includes(e.target.value))
                setSearchResult(newList)   
            }
    }
    
    //* apply add a new item to the list
    const addANewItemToTheList = (item: any) => {
        setUserCollections(prev => [...prev, item])
        setSearchResult(prev => [...prev, item])
        setSearchTerm("")
    }



    //* delete a collection from the user data and from the collections collection
    const deleteCollectionFromTheDbAndTheUserData = async (targetCollectionId: string) => {
        if (!targetCollectionId) {
            //* if there's no target id then directly exit the function
            return;
        }
        const response = await fetch(`/api/connection/collections?id=${targetCollectionId}&ownerId=${userId}`, {
            method: "DELETE"
        })
        if (response.ok) {
            const data = await response.json()
            //* update the local data so we don't need a refresh
            setUserCollections(prev => prev.filter(col => col._id !== targetCollectionId))
            setSearchResult(prev => prev.filter(col => col._id !== targetCollectionId))
        }
    }

    //* update after edit happen
    const updateAfterEditAccrues = (item: any) => {
        setSearchResult(prev => prev.map((collection:any) => collection._id === item._id? item : collection))
        setUserCollections(prev => prev.map((collection:any) => collection._id === item._id? item : collection))
        
    }

    //* empty list case widget
    const EmptyListDisplayWidget = () => {
        return (
            <div className="w-full h-full flex items-center justify-items-center justify-center">
                <img src="cat.svg" className="w-1/4 h-1/4" alt="" />
            </div>
        )
    }

    //* show loading while needed
    if (isLoading) {
        return (
            <div className="w-auto h-screen">
                <LoadingSpinner />
            </div>
        )
    }
    

    //* ui tree
    return (
        <div>
            <div className="flex justify-between">
            {/* add new collection button ---> also open the dialog  */}
            <ManageCollectionData userId={userId} isEdit={false} item={null} onAddAction={(newItem:any) => addANewItemToTheList(newItem)} />
             {/* search bar */}
             <div className=" w-1/4 rounded-lg border mb-4 px-3 py-1 flex items-center justify-self-end">
                <Search size={20}/>
                <Input
                    type='text' value={searchTerm}
                    onChange={(e) => updateSearchTerm(e)}
                    placeholder="Search..."
                    className="rounded-md ring-0 outline-none pl-2 border-transparent" />
            </div>
            </div>

            {/* display items section */}
        <div className="w-full h-full grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {searchResult.length > 0
                    && searchResult.map((collection: any) => (
                        <FolderCard
                            key={collection._id}
                            canEdit={true}
                    collection={collection}
                    userId={userId}
                    onEditAction={(newItem:any) => updateAfterEditAccrues(newItem)}
                    onDeleteAction={(collectionId:string) => deleteCollectionFromTheDbAndTheUserData(collectionId)}
                    getTheBgColorForTheCollectionFromTheMapList={getTheBgColorForTheCollectionFromTheMapList} />
                    ))
                }
            </div>
            {/* empty widget */}
            {searchResult.length === 0 && <EmptyListDisplayWidget />}
        </div>
    )
}


