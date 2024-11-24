"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FolderOpen, Clock, Share2, InfoIcon, Filter, Search, X} from "lucide-react"
import { COLORS } from "../data/standard_data"
import { AddFlashCardToCollection } from "@/components/collection/addCardsToCollection"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ManageCollectionData } from "@/components/profile/edit_collection"
import { FlashCardWidget } from "@/components/widgets/flash_card_widget"
import FilterWidget from "@/components/widgets/filter_widget"
import { DialogCloseButton } from "../dialogs/share_collection"
import { useSession } from "next-auth/react"
import getTheBgColorForTheCollectionFromTheMapList from "@/lib/manage_collection_color"
import LoadingSpinner from "@/components/animation/loading"

interface Collection {
    _id: string
    title: string
    description: string
    colorKey: string
    createdAt: string
    updatedAt: string
    collection_cards:any[]
    questions?: any[]
}

export default function CollectionPage() {
    //* consts
    const ICON_SIZE_FOLDER = 24
    const ICON_SIZE = 16

    //* manages state
    const [collection, setCollection] = useState<Collection>()
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [filterSectionState, setFilterSectionState] = useState(false)

    //* get params
    const searchParams = useSearchParams()
    const {data: session} = useSession()
    const collectionId = searchParams.get("collectionId")


    //* is the current user the owner
    const isTheCurrentUserAOwner = () => {
        return session && session.user.user_collections?.includes(collectionId ?? "NoId")
    }

    //* get the collection details like items and update date
    const getFullCollectionDetails = async () => {
        try {
            const response = await fetch(`/api/connection/collections?ids=${collectionId}`, {
                method: "GET"
            })
            if (response.ok) {
                const data = await response.json()
                setCollection(data.collections[0])
            }
        } catch (error) {
            console.error("Failed to fetch collection:", error)
        } finally {
            setIsLoading(false)
        }
    }

    //* get collection details
    useEffect(() => {
        getFullCollectionDetails()
    }, [collectionId])


    //* a loading animation 
    if (isLoading) {
        return <LoadingSkeleton />
    }

    //* a case of no collection found 
    if (!collection) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <InfoIcon className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Collection Not Found</h2>
                <p className="text-gray-500 mt-2">The requested collection could not be loaded</p>
                <Button variant="outline" className="mt-4">
                    Return to Collections
                </Button>
            </div>
        )
    }

    //* update the data in the current page
    const updateCurrentCollectionData = (editedItem: any) => {
        setCollection(editedItem)
        getFullCollectionDetails()
    }

    //* set Filter for difficulty 
    const setFilterForDifficulty = (newSelectDifficulty:string) => {
        if (selectedDifficulty === newSelectDifficulty) {
            setSelectedDifficulty("")
        } else {
            setSelectedDifficulty(newSelectDifficulty)
        }
    }

    //* toggle the filter sections
    const toggleTheFilterState = () => {
        setFilterSectionState(!filterSectionState)
        setSelectedDifficulty("")
        setSelectedLanguage("")
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Card className="bg-white dark:bg-black shadow-sm">
                <CardContent className="p-6">
                    {/* Header Section */}
                    <div className="border-b pb-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <h1 className="text-2xl font-bold flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${getTheBgColorForTheCollectionFromTheMapList(collection.colorKey)}`}>
                                            <FolderOpen size={ICON_SIZE_FOLDER} className="text-white" />
                                        </div>
                                        {collection.title}
                                    </h1>
                                    <Badge className="ml-2">
                                        {collection.collection_cards?.length || 0} items
                                    </Badge>
                                </div>
                                {/* update date  */}
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock size={ICON_SIZE} />
                                        Last updated {new Date(collection.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {/* edit / share buttons */}
                            <div className="flex space-x-2">

                                {/* share button */}
                                <DialogCloseButton collectionId={collection._id} />
                            

                                {/* edit button */}
                                {isTheCurrentUserAOwner() && <ManageCollectionData
                                 userId={"userId"}
                                 isEdit={true}
                                 item={collection}
                                 onAddAction={(newItem: any) => updateCurrentCollectionData(newItem)}
                                />}
                                
                            </div>
                        </div>

                        {/* description */}
                        <p className="mt-4 text-gray-600 max-w-3xl">
                            {collection.description}
                        </p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="py-4 flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={ICON_SIZE} />
                            <Input
                                placeholder="Search items..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>


                        {/* add new card / filter section */}
                        <div className="flex items-center space-x-2">
                            {/* switch the state of the button */}
                            <Button
                                onClick={() => toggleTheFilterState()}
                                variant="outline" className="flex items-center gap-2">
                                {filterSectionState? <X size={ICON_SIZE} /> : <Filter size={ICON_SIZE} />}
                                {filterSectionState? "Clear" : "Filter"}
                            </Button>
                            {/* show bottom sheet to add a new collection */}
                            {isTheCurrentUserAOwner() && <AddFlashCardToCollection
                                collectionData={collection}
                                onSubmitEffect={(editedCollection: any) => getFullCollectionDetails()} />}
                        </div> 
                    </div>

                    {/* filter options */}
                    {filterSectionState && <FilterWidget
                        selectedDifficulty={selectedDifficulty}
                        selectedLanguage={selectedLanguage}
                        updateSelectedDifficulty={(label: string) => setFilterForDifficulty(label)}
                        updateSelectedLanguage={(language: string) => setSelectedLanguage(language)} />}
                </CardContent>
            </Card>
              {/* Content Section */}
              <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add your content grid/list here */}
                {collection.collection_cards.map((card: any) => {
                    if (!card.title) {
                        return <LoadingSpinner />
                    }
                    if (card.title.includes(searchQuery)
                        && card.selectedLanguage.includes(selectedLanguage) 
                        && card.selectedDifficulty.includes(selectedDifficulty.toLowerCase())) {
                        return (
                            <FlashCardWidget
                        key={card._id}
                                id={card._id}
                                isOnlyShow={false}
                        title={card.title}
                        desc={card.description}
                        isEditable={false}
                        questionsCount={card.questions.length}
                        difficulty={card.selectedDifficulty}
                        language={card.selectedLanguage}
                        upVotes={card.up_Votes.length}
                        editAFlashCard={() => []}
                        deleteAFlashCard={() => []}
                    />
                        )
                            }
                        })}
                    </div>
        </div>
    )
}

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <Skeleton className="h-8 w-64" />
                    </div>
                    <div className="flex space-x-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
)