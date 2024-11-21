"use client"

import { Blocks, ChevronDown, ChevronUp, Plus, Trash, Check } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react"
import { useSession } from "next-auth/react"
import DisplayFlashCards from "./display_user_cards"
import { DIFFICULTIES, LANGUAGES } from "@/app/data/standard_data"

interface Question {
  question: string;
  options: string[];
  correctOption: number;
}

interface FlashCard {
    title: string,
    description: string | null,
    selectedLanguage: string,
    selectedDifficulty: string,
    questions: Question[],
    ownerId: string,
}

export default function CardsWidget({userId}:{userId: string}) {
    const {data: user} = useSession()
    const [isCreating, setIsCreating] = useState(false)
    const [isEditingCardId, setEditingCardId] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [questions, setQuestions] = useState<Question[]>([])
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState("")
    const [options, setOptions] = useState<string[]>([""])
    const [correctOption, setCorrectOption] = useState<number>(0)
    const [userCards, setUserCards] = useState(user?.user.flash_cards)



    //* adding questions function
    const addQuestion = () => {
        if (currentQuestion && options.some(opt => opt.trim() !== "")) {
            setQuestions([...questions, {
                question: currentQuestion,
                options: options.filter(opt => opt.trim() !== ""),
                correctOption
            }])
            setCurrentQuestion("")
            setOptions([""])
            setCorrectOption(0)
        }
    }

    //* remove a question from the card
    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, idx) => idx !== index))
        setExpandedQuestion(null)
    }

    //* add options 
    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, ""])
        }
    }

    //* clear fields
    const clearAllFields = () => {
        setTitle("")
        setDescription("")
        setSelectedDifficulty("")
        setSelectedLanguage("")
        setQuestions([])
        setIsCreating(false)
        setEditingCardId("")
    }

    //* create the flash card
    const createCard = async (flashCardData: any) => {
            // upload to the db, mainly planed to use express but ... that look more straight forward than having to use body parser too
            const response = await fetch("/api/connection/flashCards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(flashCardData),
            })
    
            const data = await response.json();
            if (response.ok) {
                setUserCards((prev: any) => [...prev, data.card])
            }
    }

    //* delete a flash card
    const deleteFlashCardFromTheDataBase = async (cardId: string) => {
        const response = await fetch(`/api/connection/flashCards?flashCardId=${cardId}&ownerId=${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
              },
        })

        if (response.status === 200) {
            //* update the current user list
            setUserCards((prev: any) => prev.filter((card: any) => card._id !== cardId))
        }
    }

    //* apply the edit to the flash card
    const applyEditToFlashCardItem = async (flashCardData:any) => {
        const response = await fetch(`/api/connection/flashCards?cardId=${isEditingCardId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(flashCardData),
        })

        if (response.ok) {
            const data = await response.json();
            if (data) {
                const updatedCards = userCards?.map((card: any) => {
                   return card._id === isEditingCardId ? data.card : card
                }
                );
                setUserCards(updatedCards) 
            }
        }
    }

    //* handle submit button
    const onSubmitButtonClicked = () => {
          // crate the data form
          const flashCardData: FlashCard = {
            title: title,
            description: description,
            selectedLanguage: selectedLanguage,
            selectedDifficulty: selectedDifficulty,
            questions: questions,
            ownerId: user?.user.id!,
        }
        if (isEditingCardId != "") {
            //* update a card state
            applyEditToFlashCardItem(flashCardData)
        } else {
            //* create a card state
            createCard(flashCardData)
        }
          // clear data
          clearAllFields()
    }

    //* set Edit flash Card
    const openCreateMenuInEditMode = async (cardId: string) => {
        const selectedCardIndex = userCards?.findIndex((card: any) => card._id === cardId)
        if (userCards) {
            const selectedCard: any = userCards[selectedCardIndex!]
            //* set the fields values
            setTitle(selectedCard.title)
            setDescription(selectedCard.description)
            setSelectedDifficulty(selectedCard.selectedDifficulty)
            setSelectedLanguage(selectedCard.selectedLanguage)
            setQuestions(selectedCard.questions)
            setIsCreating(true)
            setEditingCardId(cardId)
        }
    }

    //* open edit / create mode by the button
    const openCreateMode = () => {
        clearAllFields()
        setIsCreating(!isCreating)
    }


    //* ui tree
    return (
        <div className="w-full p-2 pt-4">
            {/* Create widget header */}
            <div 
                onClick={() => openCreateMode()}
                className="border border-solid rounded-2xl py-5 px-6 flex justify-between cursor-pointer hover:bg-gray-50 transition-all">
                <h1 className="text-lg font-medium">Create a new Flash card</h1>
                <Blocks className="text-blue-600" />
            </div>

            {/* Creation form */}
            {isCreating && (
                <div className="border border-solid rounded-2xl my-4 px-6 py-4 space-y-6 bg-white shadow-sm">
                    <div className="space-y-4">
                        {/* Basic Information */}
                        <Input 
                            placeholder="Enter card title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-medium border-0 border-b focus-visible:ring-0 px-0 rounded-none"
                        />
                        <textarea 
                            placeholder="Enter card description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px] p-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        {/* Selections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select 
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Difficulty</option>
                                {DIFFICULTIES.map(diff => (
                                    <option key={diff.value} value={diff.value}>
                                        {diff.label}
                                    </option>
                                ))}
                            </select>

                            <select 
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Language</option>
                                {LANGUAGES.map(lang => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>




                    {/* Questions Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium">Questions ({questions.length})</h2>
                            {questions.length > 0 && (
                                <span className="text-sm text-gray-500">
                                    Click to expand/collapse
                                </span>
                            )}
                        </div>


                        
                        {/* Existing Questions */}
                        <div className="space-y-3">
                            {questions.map((q, idx) => (
                                <div key={idx} className="border rounded-lg overflow-hidden">
                                    <div 
                                        onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">Q{idx + 1}.</span>
                                            <p className="font-medium">{q.question}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeQuestion(idx)
                                                }}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash size={18} />
                                            </button>
                                            {expandedQuestion === idx ? <ChevronUp /> : <ChevronDown />}
                                        </div>
                                    </div>
                                    
                                    {expandedQuestion === idx && (
                                        <div className="px-4 pb-4 pt-2 bg-gray-50">
                                            {q.options.map((opt, optIdx) => (
                                                <div key={optIdx} className="flex items-center gap-2 py-1">
                                                    {optIdx === q.correctOption ? (
                                                        <Check size={16} className="text-green-600" />
                                                    ) : (
                                                        <div className="w-4" />
                                                    )}
                                                    <p className={optIdx === q.correctOption ? "font-medium" : ""}>
                                                        {opt}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        

                        {/* New Question Form */}
                        <div className="space-y-4 border-t pt-4">
                            <Input 
                                placeholder="Enter new question..."
                                value={currentQuestion}
                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                className="font-medium"
                            />
                            
                            {options.map((option, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={correctOption === idx}
                                        onChange={() => setCorrectOption(idx)}
                                        className="cursor-pointer"
                                    />
                                    <Input 
                                        placeholder={`Option ${idx + 1}`}
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...options]
                                            newOptions[idx] = e.target.value
                                            setOptions(newOptions)
                                        }}
                                        className="flex-1"
                                    />
                                    {idx === options.length - 1 && idx < 3 ? (
                                        <Plus 
                                            className="cursor-pointer text-blue-600 hover:text-blue-700" 
                                            onClick={addOption}
                                        />
                                    ) : (
                                        <Trash 
                                            className="cursor-pointer text-red-500 hover:text-red-600"
                                            onClick={() => {
                                                const newOptions = options.filter((_, i) => i !== idx)
                                                setOptions(newOptions)
                                                if (correctOption === idx) setCorrectOption(0)
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                            
                            <button
                                onClick={addQuestion}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                            >
                                Add Question
                            </button>
                        </div>
                    </div>

                    
                    {/* Submit Button */}
                    <div>
                    <button 
                        onClick={() => onSubmitButtonClicked()}
                        disabled={!title || !selectedDifficulty || !selectedLanguage || questions.length === 0}
                        className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                    >
                        {isEditingCardId != ""? "Edit Flash Card" : "Create Flash Card"}
                    </button>
                    </div>
                </div>
            )}

            {/* display the user flash cards */}
            <DisplayFlashCards userFlashCards={userCards} editAction={(id) => openCreateMenuInEditMode(id)} deleteAction={(id) => deleteFlashCardFromTheDataBase(id)} />
        </div>
    )
}