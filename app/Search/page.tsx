"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FlashCardWidget } from "@/components/widgets/flash_card_widget"
import { Search, X, Loader2, Filter } from "lucide-react"
import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { DIFFICULTIES, LANGUAGES } from "../data/standard_data"
import FolderCard from "@/components/profile/folder_widget"
import getTheBgColorForTheCollectionFromTheMapList from "@/lib/manage_collection_color"
import Image from "next/image"

export default function SearchPage() {
  //* consts 
  const ICON_SIZE = 18
  const DEBOUNCE_DELAY = 500 // 500ms delay
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()


  //* manage state vars
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [cardsSearchResult, setCardsSearchResult] = useState<any>([])
  const [collectionsSearchResult, setCollectionSearchResult] = useState<any>([])
  const [isFocused, setIsFocused] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  //* handle search change
  const getSearchResult = async (query: string) => {
    if (!query.trim()) {
      setCardsSearchResult([])
      setCardsSearchResult([])
      return
    }
    
    try {
      setIsSearching(true)
      const response = await fetch(`/api/connection/search?searchQuery=${query}`)
      if (response.ok) {
        const data = await response.json()
        setCardsSearchResult(data.cardResult)
        setCollectionSearchResult(data.collectionsResult)
      }
    } catch (error) {
      console.error("error getting search result")
    } finally {
      setIsSearching(false)
    }
  }

  // Filter results based on selected filters
  const filteredResults = cardsSearchResult.filter((card: any) => {
    const matchesDifficulty = selectedDifficulties.length === 0 || 
      selectedDifficulties.includes(card.selectedDifficulty)
    const matchesLanguage = selectedLanguages.length === 0 || 
      selectedLanguages.includes(card.selectedLanguage)
    return matchesDifficulty && matchesLanguage
  })

  // Toggle filter selection
  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedDifficulties([])
    setSelectedLanguages([])
  }

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, DEBOUNCE_DELAY)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Trigger search on debounced query change
  useEffect(() => {
    getSearchResult(debouncedSearchQuery)
  }, [debouncedSearchQuery])

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery("")
      inputRef.current?.blur()
    }
  }

  // Clear search and focus
  const handleClearSearch = () => {
    setSearchQuery("")
    setCardsSearchResult([])
    setCollectionSearchResult([])
    inputRef.current?.focus()
  }

  // Focus input on '/' key press
  useEffect(() => {
    const handleSlashKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleSlashKey as any)
    return () => window.removeEventListener('keydown', handleSlashKey as any)
  }, [isFocused])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Find Your Perfect Flashcards
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search through our collection of flashcards to enhance your learning journey
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to clear
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to directly start typing in search
          </div>
        </div>

        {/* Search field */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative group">
            <div className={`absolute inset-0  opacity-30 rounded-lg blur transition-opacity duration-200 ${isFocused ? 'opacity-50' : 'group-hover:opacity-40'}`}></div>
            <div className={`relative border rounded-lg flex items-center px-4 py-2 shadow-sm transition-all duration-200 ${isFocused ? 'shadow-md ring-2 ring-indigo-200' : 'hover:shadow-md'}`}>
              <Search
                onClick={() => inputRef.current?.focus()}
                size={ICON_SIZE}
                className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
              />
              <Input
                ref={inputRef}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={searchQuery}
                placeholder="Start typing to search..."
                className="border-transparent border flex-1 focus:ring-0 text-lg placeholder:text-gray-300"
              />
              {searchQuery.length > 0 && (
                <div className="flex items-center gap-2">
                  {isSearching && <Loader2 size={ICON_SIZE} className="animate-spin text-indigo-600" />}
                  <X
                    onClick={handleClearSearch}
                    size={ICON_SIZE}
                    className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
              {(selectedDifficulties.length > 0 || selectedLanguages.length > 0) && 
                <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                  {selectedDifficulties.length + selectedLanguages.length}
                </span>
              }
            </Button>
            {(selectedDifficulties.length > 0 || selectedLanguages.length > 0) && (
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>

          {showFilters && (
            <div className=" p-4 rounded-lg shadow-sm border space-y-4">
              {/* Difficulty filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((difficulty) => (
                    <button
                      key={difficulty.value}
                      onClick={() => toggleDifficulty(difficulty.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedDifficulties.includes(difficulty.value)
                          ? `${difficulty.color} ${difficulty.text}`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.value}
                      onClick={() => toggleLanguage(language.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedLanguages.includes(language.value)
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results section */}
        <div className="relative">
          {filteredResults.length || collectionsSearchResult.length > 0 ? (
            <div>
              {/* cards search result */}
            {filteredResults.length > 0 && <div>
              <h2 className="text-xl font-medium mb-6">
                Found {filteredResults.length} flashcard{filteredResults.length !== 1 ? 's' : ''}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((card: any, index: number) => (
                  <div
                    key={index}
                    className="transform hover:-translate-y-1 transition-transform duration-200"
                  >
                    <FlashCardWidget
                      isOnlyShow={false}
                      id={card._id}
                      isEditable={false}
                      title={card.title}
                      desc={card.description || ""}
                      questionsCount={(card.questions || []).length}
                      difficulty={card.selectedDifficulty}
                      language={card.selectedLanguage}
                      upVotes={0}
                      editAFlashCard={() => []}
                      deleteAFlashCard={() => []}
                    />
                  </div>
                ))}
              </div>
              </div>}
              {/* collections search result */}
              {collectionsSearchResult.length > 0 && <div>
              <h2 className="text-xl font-medium mb-6">
                Found {collectionsSearchResult.length} collection{collectionsSearchResult.length !== 1 ? 's' : ''}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collectionsSearchResult.map((collection: any, index: number) => (
                  <div
                    key={index}
                    className="transform hover:-translate-y-1 transition-transform duration-200"
                  >
                    <FolderCard
                    canEdit={false}
                    collection={collection}
                    getTheBgColorForTheCollectionFromTheMapList={() => getTheBgColorForTheCollectionFromTheMapList(collection.colorKey)}
                    onDeleteAction={undefined} onEditAction={undefined}
                    userId={"NoUser"} />
                  </div>
                ))}
              </div>
              </div>}
            </div>
          ) : (
            <div className=" rounded-xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                  <Image
                    width={500}
                    height={500}
                  src='empty.svg'
                  className="h-48 w-auto mx-auto mb-6 opacity-75"
                  alt='No results found'
                />
                <h2 className="text-xl font-semibold mb-2">
                  No Flashcards Found
                </h2>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search terms or explore different topics"
                    : "Start searching to discover flashcards"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}