import { DIFFICULTIES, LANGUAGES } from "@/app/data/standard_data";
import DeleteConfirmationDialog from "@/app/dialogs/confirm_delete";
import { BookOpen, Code, Edit2, ThumbsUp, TrashIcon } from "lucide-react";
import Link from "next/link";


//* the flash card widget body 
export const FlashCardWidget = ({ 
    title, 
    id,
    desc, 
    isOnlyShow,
    isEditable, //* this one allow you to edit and delete items, in false only show the card
    questionsCount, 
    difficulty, 
    language, 
      upVotes,
      editAFlashCard,
    deleteAFlashCard,
}: { 
        title: string, 
    id:string
        desc: string, 
        isEditable: boolean,
    questionsCount: number, 
        difficulty: string, 
    isOnlyShow: boolean,
    language: string, 
          upVotes: number,
          editAFlashCard: () => {},
          deleteAFlashCard: () => {}
}) => {
    // Difficulty and language configurations (assuming these are defined elsewhere)
    const difficultyConfig = DIFFICULTIES.find(d => d.value === difficulty);
      const languageConfig = LANGUAGES.find(l => l.value === language);
      

      //* show delete dialog button
      const DeleteButton = () => {
          return (
    <button 
        className=" bg-red-50 p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors shadow-sm hover:shadow-md">
        <TrashIcon size={20} />
    </button>
      )
      }


      //* ui tree
    return (
        <div className="border relative rounded-2xl p-5 mb-4 hover:shadow-md transition-all duration-300 group">
            <Link href={isOnlyShow? "" : `/flashCard?cardId=${id}`}>
            <div className="flex justify-between items-start mb-4">
                {/* title and description section */}
                <div className="flex-grow pr-4">
                    <h2 className="text-lg font-medium mb-4 group-hover:text-blue-600 transition">{title}</h2>
                    <p className="text-gray-600 line-clamp-1">{desc}</p>
                </div>
                
                {/* create the difficulty tag */}
                {difficultyConfig && (
                    <span className={`
                        ${difficultyConfig.color} 
                        ${difficultyConfig.text}
                        px-3 py-1 rounded-full text-sm font-medium
                        self-start
                    `}>
                        {difficultyConfig.label}
                    </span>
                )}
            </div>
            </Link>

            {/* other information like question count, language ... */}
            <div className="border-t pt-4 mt-4 relative">
                <Link href={isOnlyShow? "" : `/flashCard?cardId=${id}`}>
                <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-2 border rounded-full px-2 py-1">
                            <BookOpen size={20} className="" />
                            <span>{questionsCount} Q</span>
                        </div>
                        {/* language  */}
                        <div className="flex items-center space-x-2 border rounded-full px-2 py-1">
                            <Code size={20} className="" />
                            <span>{languageConfig?.label || language}</span>
                        </div>
                        {/* up votes count */}
                        <div className="flex items-center space-x-2 border rounded-full px-2 py-1">
                            <ThumbsUp size={20} className="" />
                            <span>{upVotes}</span>
                        </div>
                    </div>

                    </div>
                </Link>

                    {/* Animated Action Buttons */}
                   {isEditable && <div className="absolute -top-8 right-0 transition-all duration-300 
                        opacity-0 group-hover:opacity-100 
                        scale-75 group-hover:scale-100
                        pointer-events-none group-hover:pointer-events-auto
                        flex flex-col space-y-2">
                        

                        {/* delete dialog */}
                        <DeleteConfirmationDialog
                            itemName={title}
                        itemType="FlashCard"
                        deleteCase={true}
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
                    </div>}
                </div>
        </div>
    )
};
