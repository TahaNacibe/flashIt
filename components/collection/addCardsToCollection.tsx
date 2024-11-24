"use client"
import { PlusCircle, CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { FlashCardWidget } from "../widgets/flash_card_widget"



export function AddFlashCardToCollection({collectionData, onSubmitEffect}:{collectionData: any, onSubmitEffect: any}) {
    //* get the session
    const { data: session } = useSession()

    //* manage state 
    const [selectedFlashCards, setSelectedFlashCards] = useState<any>([])
    const [flashCardsList, setFlashCardsList] = useState<any>([])

    //* get the collection data

    //* handle the item change state
  const updateFlashCardsInTheCollection = (cardId: string) => {
        if (selectedFlashCards.includes(cardId)) {
            setSelectedFlashCards(selectedFlashCards.filter((id: string) => id !== cardId))
        } else {
            setSelectedFlashCards((prev: any) => [...prev, cardId])
        }
    }

    //* update collection cards 
    const updateCollectionFlashCardsInTheDatabase = async () => {
        const response = await fetch(`/api/connection/collections?id=${collectionData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({collection_cards:selectedFlashCards}),
        })
        
        if (response.ok) {
            const data = await response.json()
            onSubmitEffect()
        }
    }
    
    //* get the user cards
    useEffect(() => {
        const getTheUserFlashCards = () => {
            if (session?.user.flash_cards) {
                setSelectedFlashCards(collectionData.collection_cards.map((card:any) => card._id))
                setFlashCardsList(session?.user.flash_cards)
            }
        }

        getTheUserFlashCards()
    },[session])

  return (
      <Drawer>
        {/* open dialog box button */}
      <DrawerTrigger asChild>
      <Button className="flex items-center gap-2">
        <PlusCircle size={16} />
        Add Flash Cards
        </Button>
          </DrawerTrigger>

        {/* the drawer content  */}
        <DrawerContent>
        <div className="mx-auto w-full">
        {/* headers */}
        <DrawerHeader className="flex justify-between">
        {/* title and small line  */}
        <div>
        <DrawerTitle>Select Cards</DrawerTitle>
        <DrawerDescription>Select Cards to add or deselect to remove.</DrawerDescription>
        </div>
        {/* buttons add / close */}
        <div className="gap-2 flex">
        <DrawerClose asChild> 
        <Button
        onClick={() => updateCollectionFlashCardsInTheDatabase()}
        >Submit</Button>
        </DrawerClose>
        <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
        </DrawerClose>
    </div>
    </DrawerHeader>

    {/* Add a scrollable container */}
    <div className="p-4 pb-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto max-h-[400px]">
      {flashCardsList.map((card: any) => {
        return (
          <div
            className="relative"
            key={card._id}
            onClick={(e) => updateFlashCardsInTheCollection(card._id)}
          >
                {selectedFlashCards.includes(card._id) && (
              <div className="w-full h-auto mb-4 bg-black z-50 inset-0 absolute rounded-lg bg-opacity-5 flex items-center justify-center">
                {/* cover  */}
                <CircleCheck size={50} />
              </div>
                )}
                {/* flash card  */}
            <FlashCardWidget
              title={card.title}
              id={card._id}
              desc={card.description}
              isOnlyShow={true}
              isEditable={false}
              questionsCount={card.questions.length}
              difficulty={card.selectedDifficulty}
              language={card.selectedLanguage}
              upVotes={card.up_Votes.length ?? 0}
              editAFlashCard={() => []}
              deleteAFlashCard={() => []}
            />
          </div>
        );
      })}
    </div>

    
  </div>
</DrawerContent>

    </Drawer>
  )
}
