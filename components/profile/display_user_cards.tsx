import { useEffect, useState } from "react"
import { Search } from 'lucide-react';
import { Separator } from "@radix-ui/react-separator";
import { FlashCardWidget } from "../widgets/flash_card_widget";
import { Input } from "../ui/input";


  



//* display the flash cards list ---> GRID VIEW 
export default function DisplayFlashCards({ userFlashCards, deleteAction, editAction }: { userFlashCards: any,deleteAction : (id:string)=>{}, editAction: ( id: string) => {} }) {
    //* state management vars 
    const [userCards, setUserCards] = useState<any[]>([])
    const [resultList, setResultList] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    //* update user flash cards list when it's offered 
    useEffect(() => {
        if (userFlashCards) {
            setUserCards(userFlashCards)
            setResultList(userFlashCards)
        }
    }, [userFlashCards])

    //* update the search term
    const updateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        if (e.target.value === "") {
            setResultList(userCards)
        } else {
            const newList = userCards.filter((card) => card.title.includes(e.target.value))
            setResultList(newList)   
        }
    }
 
    //* ui tree
    return (
        <div className="container mx-auto pt-4">
            {/* separator */}
            <Separator />
            {/* search bar */}
            <div className=" w-1/4 rounded-lg border mb-4 px-3 py-1 flex items-center justify-self-end">
                <Search size={20}/>
                <Input
                    type='text' value={searchTerm}
                    onChange={(e) => updateSearchTerm(e)}
                    placeholder="Search..."
                    className="rounded-md ring-0 outline-none pl-2 border-transparent" />
            </div>

            {/* cards  */}
            {resultList.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resultList.map((card, index) => (
                        <FlashCardWidget 
                            key={index}
                            id={card._id}
                            isOnlyShow={false}
                            isEditable={true}
                            title={card.title} 
                            desc={card.description || ""} 
                            questionsCount={(card.questions || []).length} 
                            difficulty={card.selectedDifficulty} 
                            language={card.selectedLanguage} 
                            upVotes={card.up_Votes.length} 
                            editAFlashCard={() => editAction(card._id)}
                            deleteAFlashCard={() => deleteAction(card._id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl flex flex-col items-center justify-center">
                        <img src='empty.svg' className="h-1/5 w-1/5" alt='' />
                        <h1 className="pt-8 text-lg">
                            No FlashCards found
                        </h1>
                </div>
            )}
        </div>
    )
}