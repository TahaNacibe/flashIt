import { useEffect, useState } from "react"
import { BookOpen, Layers, Code, ThumbsUp, TrashIcon, Edit2, Search } from 'lucide-react';
import { DIFFICULTIES, LANGUAGES } from "@/app/data/standard_data"
import { Separator } from "@radix-ui/react-separator";
import DeleteConfirmationDialog from "@/app/dialogs/confirm_delete";

  
  interface FlashCard {
      title: string,
      description: string | null,
      selectedLanguage: string,
      selectedDifficulty: string,
      questions: [{
        question: string;
        options: string[];
        correctOption: number;
      }],
      ownerId: string;
      _id:string
  }
  const FlashCardWidget = ({ 
    title, 
    desc, 
    questionsCount, 
    difficulty, 
    language, 
      upVotes,
      editAFlashCard,
    deleteAFlashCard,
}: { 
    title: string, 
    desc: string, 
    questionsCount: number, 
    difficulty: string, 
    language: string, 
          upVotes: number,
          editAFlashCard: () => {},
          deleteAFlashCard: () => {}
}) => {
    // Difficulty and language configurations (assuming these are defined elsewhere)
    const difficultyConfig = DIFFICULTIES.find(d => d.value === difficulty);
      const languageConfig = LANGUAGES.find(l => l.value === language);
      

      //* delete dialog button
      const DeleteButton = () => {
          return (
            <button 
        className="
        bg-red-50 p-2 rounded-full 
        hover:bg-red-100 
        text-red-600 
        transition-colors 
        shadow-sm hover:shadow-md"
    >
        <TrashIcon size={20} />
    </button>
      )
      }

    return (
        <div className="bg-white border relative border-gray-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-grow pr-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 group-hover:text-blue-600 transition">{title}</h2>
                    <p className="text-gray-600 line-clamp-2">{desc}</p>
                </div>
                
                {difficultyConfig && (
                    <span className={`
                        ${difficultyConfig.color} 
                        px-3 py-1 rounded-full text-sm font-medium
                        self-start
                    `}>
                        {difficultyConfig.label}
                    </span>
                )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 relative">
                <div className="flex items-center justify-between text-gray-600">
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-2 border rounded-full px-2 py-1">
                            <BookOpen size={20} className="text-gray-500" />
                            <span>{questionsCount} Q</span>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-full px-2 py-1">
                            <Code size={20} className="text-gray-500" />
                            <span>{languageConfig?.label || language}</span>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-full px-2 py-1">
                            <ThumbsUp size={20} className="text-gray-500" />
                            <span>{upVotes}</span>
                        </div>
                    </div>

                    {/* Animated Action Buttons */}
                    <div className="absolute -top-8 right-0 transition-all duration-300 
                        opacity-0 group-hover:opacity-100 
                        scale-75 group-hover:scale-100
                        pointer-events-none group-hover:pointer-events-auto
                        flex flex-col space-y-2">
                        

                        {/* delete dialog */}
                        <DeleteConfirmationDialog
                            itemName={title}
                            itemType="FlashCard"
                            title={"Are you sure?"}
                            trigger={DeleteButton()}
                            onConfirm={deleteAFlashCard}/>
                       
                        
                        {/* edit button */}
                        <button 
                            onClick={() => editAFlashCard()}
                            className="
                            bg-green-50 p-2 rounded-full 
                            hover:bg-green-100 
                            text-green-600 
                            transition-colors 
                            shadow-sm hover:shadow-md"
                        >
                            <Edit2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default function DisplayFlashCards({ userFlashCards, deleteAction, editAction }: { userFlashCards: any,deleteAction : (id:string)=>{}, editAction: ( id: string) => {} }) {
    const [userCards, setUserCards] = useState<FlashCard[]>([])
    const [resultList, setResultList] = useState<FlashCard[]>([])
    const [searchTerm, setSearchTerm] = useState("")

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
            const newList = userCards.filter((card) => card.title.includes(searchTerm))
            setResultList(newList)   
        }
    }

    //* update the search list 

    return (
        <div className="container mx-auto pt-4">
            {/* separator */}
            <Separator />
            {/* search bar */}
            <div className=" w-1/4 rounded-lg border mb-4 px-3 py-2 flex items-center justify-self-end">
                <Search size={20}/>
                <input
                    type='text' value={searchTerm}
                    onChange={(e) => updateSearchTerm(e)}
                    placeholder="Search..."
                    className="rounded-md ring-0 outline-none pl-2" />
            </div>

            {/* cards  */}
            {resultList.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resultList.map((card, index) => (
                        <FlashCardWidget 
                            key={index}
                            title={card.title} 
                            desc={card.description || ""} 
                            questionsCount={(card.questions || []).length} 
                            difficulty={card.selectedDifficulty} 
                            language={card.selectedLanguage} 
                            upVotes={0} 
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