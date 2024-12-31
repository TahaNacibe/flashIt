import mongoose from "mongoose";
import { useEffect, useState } from "react";
import { FlashCardWidget } from "../widgets/flash_card_widget";
import LoadingSpinner from "../animation/loading";
import Image from "next/image";



export default function RelatedFlashCards({ cardId, cardLanguage, cardDifficulty }
    : { cardId: string, cardLanguage: string, cardDifficulty: string }) {
    
    const [relatedCardsList, setRelatedCardsList] = useState<any>([])
    const [loadingState, setLoadingState] = useState(true)

    useEffect(() => {
        const getTheListOfRelatedCards = async () => {
            if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) return;
            try {
                const response = await fetch(`/api/connection/quiz?cardId=${cardId}&difficulty=${cardDifficulty}&language=${cardLanguage}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.cards) {
                        const receivedListOfCards = data.cards.filter((card:any) => card._id !== cardId)
                        setRelatedCardsList(receivedListOfCards);    
                    }
                }
            } catch (error) {
                console.error("failed to get the card data");
            } finally {
                setLoadingState(false);
            }
        }
        getTheListOfRelatedCards()
    }, [cardId])
    

    if (loadingState) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div>
            {/* cards  */}
            {relatedCardsList.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedCardsList.map((card:any, index:any) => (
                        <FlashCardWidget 
                            key={index}
                            id={card._id}
                            isEditable={false}
                            isOnlyShow={false}
                            title={card.title} 
                            desc={card.description || ""} 
                            questionsCount={(card.questions || []).length} 
                            difficulty={card.selectedDifficulty} 
                            language={card.selectedLanguage} 
                            upVotes={0} 
                            editAFlashCard={() => []}
                            deleteAFlashCard={() => []}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 rounded-xl flex flex-col items-center justify-center">
                        <Image width={500} height={500} src='empty.svg' className="h-1/5 w-1/5" alt='' />
                        <h1 className="pt-8 text-lg">
                            No FlashCards found
                        </h1>
                </div>
            )}
        </div>
    )
}