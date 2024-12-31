"use client"
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashCardWidget } from "@/components/widgets/flash_card_widget";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Clock, 
  Star, 
  BookOpen, 
  RefreshCcw,
  ChevronRight,
  Sparkles,
  Users,
  FolderArchive
} from "lucide-react";
import Link from "next/link";
import FolderCard from "@/components/profile/folder_widget";
import { useSession } from "next-auth/react";
import getTheBgColorForTheCollectionFromTheMapList from "@/lib/manage_collection_color";


const DiscoverPage = () => {
  //* get params
  const { data: session } = useSession()
  
  //* consts 
  const ICON_SIZE = 20;

  //* manage lists data
  const [trendingCards, setTrendingCards] = useState<any>([]);
  const [newCards, setNewCards] = useState<any>([]);
  const [updatedCards, setUpdatedCards] = useState<any>([]);
  const [newCollectionsData, setNewCollections] = useState<any>([]);
  const [topRatedCards, setTopRatedCards] = useState<any>([]);

  //* manage counters number
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [totalCardsCount, setTotalCardsCount] = useState<number>(0);
  const [totalCollectionsCount, setTotalCollectionsCount] = useState<number>(0);

  //* manage state loading active tab animation
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("trending");
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const fetchDiscoverContent = async () => {
      try {
        //* set loading state
        setLoading(true);

        //* get the data from api
        const [trending, newest, updated, topRated, newCollections ,stats] = await Promise.all([
          fetch('/api/connection/flashCards/trending').then(res => res.json()),
          fetch('/api/connection/flashCards/latest').then(res => res.json()),
          fetch('/api/connection/flashCards/latest').then(res => res.json()),
          fetch('/api/connection/flashCards/top-rated').then(res => res.json()),
          fetch('api/connection/collections/').then(res => res.json()),
          fetch('api/connection/statics').then(res => res.json())
        ]);

        //* update values for lists
        setTrendingCards(trending.flashCards);
        setNewCards(newest.flashCards);
        setUpdatedCards(updated.flashCards);
        setTopRatedCards(topRated.flashCards);
        setNewCollections(newCollections.collections)

        //* update values for counters 
        setTotalCardsCount(stats.totalCards ?? 0);
        setTotalUsersCount(stats.totalUsers ?? 0);
        setTotalCollectionsCount(stats.totalCollections ?? 0)
        
        // Trigger stats animation after data loads
        setTimeout(() => setAnimateStats(true), 100);
      } catch (error) {
        console.error('Error fetching discover content:', error);
      } finally {
        //* exit loading
        setLoading(false);
      }
    };

    fetchDiscoverContent();
  }, []);


  //* animation widget
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );


  //* tab to switch visible items
  const SectionTab = ({ icon, title, id }: { icon: React.ReactNode; title: string; id: string }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
        activeSection === id
          ? "bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white font-medium shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-700"
          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
      }`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );


  //* get the list of the active tab based on var 
  const getActiveCards = () => {
    return {
      trending: trendingCards,
      new: newCards,
      updated: updatedCards,
      topRated: topRatedCards,
      collections:newCollectionsData
    }[activeSection];
  };


  //* ui tree
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
            <Sparkles size={16} className="mr-2" />
            <span className="text-sm font-medium">Discover new ways to learn</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Discover Amazing Flash Cards
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our collection of high-quality flash cards created by the community.
            Learn, practice, and master new topics.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* total cards card */}
          <Card className={`bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-300 dark:to-indigo-300 transform transition-all duration-500 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">Total Cards</p>
                  <p className="text-3xl font-semibold text-gray-900">{totalCardsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm ring-1 ring-indigo-100">
                  <BookOpen className="text-indigo-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* total users card */}
          <Card className={`bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-100 dark:to-teal-300 transform transition-all duration-500 delay-100 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Active Learners</p>
                  <p className="text-3xl font-semibold text-gray-900">{totalUsersCount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm ring-1 ring-emerald-100">
                  <Users className="text-emerald-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* total collections card */}
          <Card className={`bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-100 dark:to-orange-300 transform transition-all duration-500 delay-200 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Collections made by community</p>
                  <p className="text-3xl font-semibold text-gray-900">{totalCollectionsCount}</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm ring-1 ring-amber-100">
                  <FolderArchive className="text-amber-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-12 overflow-x-auto pb-2">
          <SectionTab icon={<TrendingUp size={ICON_SIZE} />} title="Trending Now" id="trending" />
          <SectionTab icon={<Clock size={ICON_SIZE} />} title="New Arrivals" id="new" />
          <SectionTab icon={<RefreshCcw size={ICON_SIZE} />} title="Recently Updated" id="updated" />
          <SectionTab icon={<Star size={ICON_SIZE} />} title="Top Rated" id="topRated" />
          <SectionTab icon={<FolderArchive size={ICON_SIZE} />} title="Collections" id="collections" />
        </div>

        {/* Cards Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getActiveCards().map((card: any, index: number) => (
              <div 
                key={card._id} 
                className={`transform hover:scale-105 transition-all duration-300 opacity-0 animate-in`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease forwards'
                }}
              >
                {/* card view if any of the cards list  */}
                {activeSection !== "collections"
                  ? <FlashCardWidget
                  id={card._id}
                  isEditable={false}
                  isOnlyShow={false}
                  title={card.title}
                  desc={card.description}
                  questionsCount={card.questions.length}
                  difficulty={card.selectedDifficulty}
                  language={card.selectedLanguage}
                  upVotes={(card.up_Votes ?? []).length }
                  editAFlashCard={() => []}
                  deleteAFlashCard={() => []}
                  />
                  : <FolderCard
                    canEdit={false}
                    collection={card}
                    getTheBgColorForTheCollectionFromTheMapList={() => getTheBgColorForTheCollectionFromTheMapList(card.colorKey)}
                    onDeleteAction={undefined} onEditAction={undefined}
                    userId={session?.user.id ?? "NoUser"} />}
              {/* collection if it's a collection */}
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl p-12 mt-20 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Create Your Own Flash Cards?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Share your knowledge with the community and help others learn while mastering topics yourself
            </p>
            <Link href={"/Profile"}>
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span>Create Flash Cards</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
          </div>
        </div>
      </div>
      

      {/* didn't work other place for some reason*/}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DiscoverPage;