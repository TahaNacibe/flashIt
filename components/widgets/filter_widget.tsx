import { DIFFICULTIES, LANGUAGES } from "@/app/data/standard_data"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "../ui/button"


export default function FilterWidget({ updateSelectedDifficulty, updateSelectedLanguage, selectedDifficulty, selectedLanguage }
    : { updateSelectedDifficulty: any, selectedDifficulty:string ,updateSelectedLanguage: any, selectedLanguage:string }) {
    return (
        <div className="md:flex justify-between">
            {/* select difficulty */}
            <div className="flex gap-2">
                {DIFFICULTIES.map((dif) => (
                <div key={dif.label}
                    onClick={() => updateSelectedDifficulty(dif.label)}
                    className={`inline-flex items-center rounded-md border 
                    px-3 py-2 text-xs font-semibold transition-colors
                    cursor-pointer hover:bg-opacity-25
                    dark:hover:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${selectedDifficulty === dif.label? `${dif.text} ${dif.color}` : `bg-white dark:bg-black border ` }`} >
                <h1> {dif.label} </h1>
                </div>
            ))}
        </div>
            
            {/* select language */}
            <div className="flex gap-2">

                
                {/* the clear button */}
               {selectedLanguage !== ""? <Button onClick={() => updateSelectedLanguage("")}>
                    Clear
                </Button> : <div></div>}


                {/* the select language */}
            <Select
                value={selectedLanguage}
                onValueChange={(e) => updateSelectedLanguage(e)}>
           <SelectTrigger className="w-[180px] pt-2">
             <SelectValue placeholder="Select a Language" />
           </SelectTrigger>
           <SelectContent>
             <SelectGroup>
             <SelectLabel>Languages</SelectLabel>
             {LANGUAGES.map((language) => (
            <SelectItem
                key={language.label}
                value={language.value}> {language.label} </SelectItem>
             ))}
        </SelectGroup>
      </SelectContent>
    </Select>
            </div>
            </div>
    )
}