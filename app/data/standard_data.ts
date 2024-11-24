//* languages list for the flash card content
const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
  ]
  

  //* difficulties list for the card content
  const DIFFICULTIES = [
    { value: 'easy', label: 'Easy', color: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
  { value: 'hard', label: 'Hard', color: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' },
  { value: 'expert', label: 'Expert', color: 'bg-rose-100', text: 'text-rose-700', icon: 'text-rose-600' },
]


//* Colors list for the collections decoration
const COLORS = [
  {label: "blue", color:"bg-blue-300"},
  {label: "green", color:"bg-green-300"},
  {label: "red", color:"bg-red-300"},
  {label: "yellow", color:"bg-yellow-300"},
  {label: "orange", color:"bg-orange-300"},
  {label: "indigo", color:"bg-indigo-300"},
  {label: "teal", color:"bg-teal-300"},
  {label: "pink", color:"bg-pink-300"},
  {label: "gray", color:"bg-gray-300"},
]
  
export {DIFFICULTIES, LANGUAGES,COLORS}