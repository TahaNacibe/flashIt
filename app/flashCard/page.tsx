"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Clock, Info, Users, Trophy, ThumbsUp,ThumbsDown , Bookmark, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import mongoose from "mongoose";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QuizDialog } from "../dialogs/quiz_dialog";
import { DIFFICULTIES } from "../data/standard_data";
import LeaderBoardWidget from "@/components/flashcards/leaderborde";
import RelatedFlashCards from "@/components/flashcards/relatedCards";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/animation/loading";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from 'react'


export default function FlashCardTestSuspense() {
    return (
        <Suspense>
      <FlashCardTest />
    </Suspense>
    )
}

function FlashCardTest() {
    //* get params
    const searchParams = useSearchParams();
    const router = useRouter()
    const flashCardId = searchParams.get("cardId");
    const { data: session } = useSession()
    const { toast } = useToast()

    //* manage state
    const [currentFlashCard, setTheCurrentFlashCard] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    //* consts 
    const difficulty = DIFFICULTIES.find(d => d.value === currentFlashCard?.selectedDifficulty);

    useEffect(() => {
        //* get the flash card detail from the data base 
        const getCurrentFlashCardDetails = async () => {
            if (!flashCardId || !mongoose.Types.ObjectId.isValid(flashCardId)) return;
            try {
                const response = await fetch(`/api/connection/flashCards?cardId=${flashCardId}`);
                if (response.ok) {
                    //* update if the response was success 
                    const data = await response.json();
                    setTheCurrentFlashCard(data.card);
                }
            } catch (error) {
                console.error("failed to get the card data");
            } finally {
                //* stop loading
                setIsLoading(false);
            }
        };
        getCurrentFlashCardDetails();
    }, [flashCardId]);

    //* loading widget (loading place holder)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-background px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-96 bg-white dark:bg-black rounded-lg shadow-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-pulse text-lg font-medium text-gray-600">
                            <LoadingSpinner />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    //* in case the id isn't correct and the card wasn't obtained 
    if (!currentFlashCard && !isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Unable to load flash card.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    //* update the copy of the card the user is currently in when he clear the quiz
    function updateCardDataAfterTheClear(newCard:any) {
        if (newCard) {
            setTheCurrentFlashCard(newCard)
        }
    }


    //* handle the up votes add or remove 
    async function updateUpVoteStateForTheFlashCard() {
        if (!session) {
            toast({
                title: "Need to sign in first",
                description: "can't interact with cards without account.",
                variant:"default"
            })
            return;
        }
        try {
            const response = await fetch("/api/connection/flashCards/up_vote", {
                method: "PUT",
                body:JSON.stringify({userId:session?.user.id, cardId:currentFlashCard._id})
            })

            if (response.ok) {
                const data = await response.json()
                setTheCurrentFlashCard(data.card)
            }
        } catch (error) {
            console.error("error getting the up vote update")
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost" size="sm" className=" hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Collection
                    </Button>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold  mb-2">Flash Card Details</h1>
                    <p className="text-gray-600">
                        View card information and start practicing
                    </p>
                </div>

                {/* Main Card */}
                <div className="mb-8">
                    <Card className="shadow-md">
                        <CardHeader className="space-y-6 w-full">
                            <div className="flex items-start justify-between gap-4 w-full">
                                <div className="space-y-4 w-full">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className={`p-3 rounded-lg ${difficulty?.color || 'bg-gray-100'}`}>
                                            <CreditCard className={`h-6 w-6 ${difficulty?.icon || 'text-gray-600'}`} />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {currentFlashCard.title}
                                            </CardTitle>
                                            <div className="flex flex-wrap w-full gap-2">
                                                <Badge variant="secondary" className="px-2 py-1">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {currentFlashCard.questions?.length || 0} Questions
                                                </Badge>
                                                <div className="flex gap-2">
                                                <Badge variant="outline" className={`px-2 py-1 ${difficulty?.color} ${difficulty?.text}`}>
                                                    {difficulty?.label || currentFlashCard.selectedDifficulty}
                                                </Badge>
                                                <Badge variant="outline" className="bg-violet-50 text-violet-700 px-2 py-1">
                                                    {currentFlashCard.selectedLanguage}
                                                </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* up vote button */}
                                <Button
                                    onClick={() => updateUpVoteStateForTheFlashCard()}
                                    className="gap-2" size="lg">
                                    {currentFlashCard.up_Votes.includes(session?.user.id)? <ThumbsDown /> : <ThumbsUp /> }
                                    { currentFlashCard.up_Votes.includes(session?.user.id)? "Remove vote": 'Up Vote it'}
                                </Button>
                                {/* start quiz button */}
                                {session &&  <QuizDialog flashCard={currentFlashCard}
                                    onRecordUpdate={(newCard: any) => updateCardDataAfterTheClear(newCard)} />}
                               
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <div className="bg-gray-50 dark:bg-black rounded-lg p-6">
                                        <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Info className="h-4 w-4 text-gray-500 dark:text-white" />
                                            Description
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {currentFlashCard.description}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-white dark:bg-black border rounded-lg p-6">
                                        <h3 className="font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Trophy className="h-4 w-4 text-amber-500" />
                                            Card Statistics
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm dark:text-white">Up Votes</span>
                                                <Badge className="bg-blue-50 text-blue-700 flex items-center gap-1">
                                                    <ThumbsUp className="h-3 w-3" />
                                                    {currentFlashCard.up_Votes.length}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm dark:text-white">Top Score</span>
                                                <Badge className="bg-emerald-50 text-emerald-700 flex items-center gap-1">
                                                    {Math.max(0,...(currentFlashCard.rankingBoard || []).map((r: any) => 
                                                        r.numberOfCorrectAnswers)) || 0}
                                                    /{currentFlashCard.questions?.length}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm dark:text-white">Best Time</span>
                                                <Badge className="bg-violet-50 text-violet-700 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {/* get the best timing or 0 as default */}
                                                    {Math.min(0,...(currentFlashCard.rankingBoard || []).map((r: any) => 
                                                        r.clearTimeInSeconds)) || 0}s
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`rounded-lg p-6 ${difficulty?.color || 'bg-gray-50'}`}>
                                <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                                    <Bookmark className={`h-4 w-4 ${difficulty?.icon || 'text-gray-600'}`} />
                                    Quiz Rules & Information
                                </h3>
                                <p className={`${difficulty?.text || 'text-gray-600'} text-sm leading-relaxed`}>
                                    Each question has a 10-second time limit. Unanswered questions count as incorrect.
                                    Complete the quiz to view your score and rank on the leaderboard. 
                                    An answer sheet will be available for reference after completion.
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    Last updated {new Date(currentFlashCard.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Related Cards Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Related Flash Cards</h2>
                        <Link href={"/Discover"}>
                        <Button variant="outline" size="sm">
                            View More
                        </Button>
                        </Link>
                    </div>
                    <div>
                    <RelatedFlashCards cardId={currentFlashCard._id} cardLanguage={currentFlashCard.selectedLanguage} cardDifficulty={currentFlashCard.selectedDifficulty} />
                    </div>
                </div>
                <div className="pt-4">
                <LeaderBoardWidget flashCardId={currentFlashCard._id}  />
                </div>
            </div>
        </div>
    );
}