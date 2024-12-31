import { Check, Timer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { DIFFICULTIES, LANGUAGES } from "../data/standard_data"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

export function QuizDialog({ flashCard, onRecordUpdate }: { flashCard: any, onRecordUpdate: any }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [score, setScore] = useState(0)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [answers, setAnswers] = useState<Array<{ correct: boolean, time: number }>>([])

  const { data: session } = useSession()
  const { toast } = useToast()

  const difficulty = DIFFICULTIES.find(d => d.value === flashCard.selectedDifficulty)
  const language = LANGUAGES.find(l => l.value === flashCard.selectedLanguage)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isQuizActive && timeLeft > 0 && !quizComplete) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
        setTotalTime(prev => prev + 1)
        setProgress(prev => prev + (100 / (10 * 100)))
      }, 1000)
    } else if (timeLeft === 0 && !quizComplete) {
      handleNextQuestion()
      setAnswers(prev => [...prev, { correct: false, time: 10 }])
    }
    return () => clearInterval(timer)
  }, [timeLeft, isQuizActive, quizComplete])

  const startQuiz = () => {
    setIsQuizActive(true)
    setTimeLeft(10)
    setProgress(0)
    setScore(0)
    setCurrentQuestionIndex(0)
    setQuizComplete(false)
    setTotalTime(0)
    setAnswers([])
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption === null) {
      setSelectedOption(optionIndex)
      const isCorrect = optionIndex === flashCard.questions[currentQuestionIndex].correctOption
      if (isCorrect) {
        setScore(prev => prev + 1)
      }
      setAnswers(prev => [...prev, { correct: isCorrect, time: 10 - timeLeft }])
    }
  }

  //* update the score in the leader board
  const updateUserRecordInLeaderBoard = async () => {
    const response = await fetch("/api/connection/quiz/", {
      method: "PUT",
      body: JSON.stringify({
        userId:session?.user.id, numberOfCorrectAnswers:score ,clearTimeInSeconds:totalTime.toFixed(1), cardId:flashCard._id
      })
    })

    if (response.ok) {
      const data = await response.json()
      onRecordUpdate(data.card)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < flashCard.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTimeLeft(10)
      setProgress(0)
      setSelectedOption(null)
    } else {
      setQuizComplete(true)
      setIsQuizActive(false)
      updateUserRecordInLeaderBoard()
    }
  }

  const currentQuestion = flashCard.questions[currentQuestionIndex]
  const averageResponseTime = answers.length ? 
    answers.reduce((acc, curr) => acc + curr.time, 0) / answers.length : 0
  
  
  //* a small trick to keep unsigned users from playing
  if (!session) {
    return (
      <Button onClick={() =>  toast({
        title: "Need to sign in first",
        description: "can't interact with cards without account.",
        variant:"default"
    })}
      className="gap-2" size="lg">
      Start Quiz
      <Timer className="h-5 w-5" />
    </Button>
    )
  }

  //* ui tree
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="gap-2" size="lg">
          Start Quiz
          <Timer className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {!isQuizActive && !quizComplete ? (
              "Ready to start the quiz?"
            ) : (
              <div className="flex justify-between w-full items-center">
                <div className="flex items-center gap-2">
                  <Badge className={`${difficulty?.color}  ${difficulty?.text}`}>
                    {difficulty?.label}
                  </Badge>
                  <Badge variant="outline">
                    {language?.label}
                  </Badge>
                </div>
                <Badge variant="secondary" className="ml-2">
                  <Timer className="h-4 w-4 mr-1" />
                  {timeLeft}s
                </Badge>
              </div>
            )}
          </DialogTitle>
          
          {!isQuizActive && !quizComplete && (
            <DialogDescription>
              Test your {language?.label} knowledge at {difficulty?.label} level
            </DialogDescription>
          )}
        </DialogHeader>

        {isQuizActive && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-500 dark:text-white dark:bg-background">
              <span>Question {currentQuestionIndex + 1}/{flashCard.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!isQuizActive && !quizComplete && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
                <p className="font-medium">Questions</p>
                <p className="text-gray-600 dark:text-white">{flashCard.questions.length} total</p>
              </div>
              <div className={`p-3 rounded-lg ${difficulty?.color} ${difficulty?.text}`}>
                <p className="font-medium">Difficulty</p>
                <p>{difficulty?.label}</p>
              </div>
            </div>
            <Button onClick={startQuiz} className="w-full">
              Begin Quiz
            </Button>
          </div>
        )}

        {isQuizActive && !quizComplete && (
          <div className="space-y-6">
            <p className="text-lg font-medium">{currentQuestion.question}</p>
            <div className="grid gap-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedOption === null ? "outline" : 
                          index === currentQuestion.correctOption ? "default" :
                          index === selectedOption ? "destructive" : "outline"}
                  className="justify-between h-auto py-4 px-4"
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                >
                  <span>{option}</span>
                  {selectedOption !== null && index === currentQuestion.correctOption && 
                    <Check className="h-4 w-4 text-green-500" />}
                  {selectedOption === index && index !== currentQuestion.correctOption && 
                    <X className="h-4 w-4 text-red-500" />}
                </Button>
              ))}
            </div>
            
            {selectedOption !== null && (
              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex === flashCard.questions.length - 1 ? 
                  "Complete Quiz" : "Next Question"}
              </Button>
            )}
          </div>
        )}

        {quizComplete && (
          <div className="space-y-6">
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>Final Score: {score}/{flashCard.questions.length}</span>
                <span>{Math.round((score/flashCard.questions.length) * 100)}%</span>
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-800">
                <p className="font-medium">Average Response Time</p>
                <p className="text-gray-600">{averageResponseTime.toFixed(1)} seconds</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-800">
                <p className="font-medium">Total Time</p>
                <p className="text-gray-600">{totalTime.toFixed(1)} seconds</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Question Summary</h3>
              <div className="grid gap-2">
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="flex items-center gap-2">
                      {answer.correct ? 
                        <Check className="h-4 w-4 text-green-500" /> : 
                        <X className="h-4 w-4 text-red-500" />}
                      Question {index + 1}
                    </span>
                    <span className="text-sm text-gray-500">{answer.time.toFixed(1)}s</span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={startQuiz} variant="outline">
                Try Again
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}