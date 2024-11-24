"use client"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, Clock, CheckCircle2, Trophy, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserScore {
    clearTimeInSeconds: number;
    numberOfCorrectAnswers: number;
    userId: {
        email: string;
        name: string;
        image: string;
        _id: string;
    };
    _id: string;
}

export default function LeaderBoardWidget({ flashCardId }: { flashCardId: string }) {
    //* get params
    const { data: session } = useSession();

    //* manage state
    const [isLoading, setIsLoading] = useState(true);
    const [rankings, setRankings] = useState<UserScore[]>([]);


    //* get the card record board
    useEffect(() => {
        getFlashCardRecord();
    }, [flashCardId]);



    const getFlashCardRecord = async () => {
        try {
            const response = await fetch(`/api/connection/quiz?cardId=${flashCardId}`);
            //* if the response exist and is ok
            if (response.ok) {
                const data = await response.json();
                const sortedRankings = data.record.rankingBoard.sort((a: UserScore, b: UserScore) => {
                    // Sort by correct answers first, then by time
                    if (b.numberOfCorrectAnswers !== a.numberOfCorrectAnswers) {
                        return b.numberOfCorrectAnswers - a.numberOfCorrectAnswers;
                    }
                    return a.clearTimeInSeconds - b.clearTimeInSeconds;
                });
                setRankings(sortedRankings);
            }
        } catch (error) {
            console.error("Failed to get the card data");
        } finally {
            //* update loading state
            setIsLoading(false);
        }
    };


    //* get the medal color based on the rank (only top 3)
    const getMedalColor = (index: number) => {
        switch (index) {
            case 0:
                return "text-yellow-500";
            case 1:
                return "text-gray-400";
            case 2:
                return "text-amber-600";
            default:
                return "text-gray-400";
        }
    };


    //* loading place holder section
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                {rankings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No attempts recorded yet.
                        Be the first to complete this quiz!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rankings.map((score, index) => (
                            <div
                                key={score._id}
                                className={`flex items-center gap-3 p-3 rounded-lg 
                                ${score.userId._id === session?.user?.id 
                                    ? 'bg-blue-50 dark:bg-gray-700 border border-blue-100 dark:border-gray-600' 
                                    : 'bg-gray-50 dark:bg-gray-950'}`}
                            >
                                <div className="flex-shrink-0 w-8 flex justify-center">
                                    {index < 3 ? (
                                        <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                                    ) : (
                                        <span className="text-gray-500 font-medium">{index + 1}</span>
                                    )}
                                </div>
                                
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={score.userId.image} alt={score.userId.name} />
                                    <AvatarFallback>
                                        {score.userId.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-grow min-w-0">
                                    <div className="font-medium text-sm truncate">
                                        {score.userId.name}
                                        {score.userId._id === session?.user?.id && (
                                            <span className="ml-2 text-blue-600 text-xs">(You)</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        {score.numberOfCorrectAnswers}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {score.clearTimeInSeconds}s
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}