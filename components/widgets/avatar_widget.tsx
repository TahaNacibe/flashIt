import Image from "next/image";

  
export function AvatarWidget({ imageUrl, userName, isHidden }: { imageUrl: string | undefined, userName: string | undefined, isHidden: boolean }) {
  if (imageUrl) {
      //* show the profile bottom tile
      return (
        <div className="flex gap-2">
          <Image width={300} height={300} src={imageUrl} className="w-8 h-8 rounded-full" alt='' />
          <h2 className={`${isHidden ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{userName}</h2>
       </div>
      )
      
  } else {

    //* get the display text in the pfp
    const getNameParts = () => {


      // split the name by spaces
      const nameParts = userName ?? "Guest User" .split(" ")
      let displayText = "";


      // get the max limit of letters to display 
      const limitOfLetters = nameParts.length < 1 ? nameParts.length : 2
      

      // loop and get each part's first letter
      for (let index = 0; index < limitOfLetters; index++) {
        displayText += nameParts[index][0]
      }
      return displayText
    }


      //* in case no image was provided show that widget
    return (
        <div className="flex gap-2">
        <div className="rounded-full h-8 w-8 bg-blue-900 text-white items-center text-center flex justify-center font-medium text-sm">
          <span>{ getNameParts() }</span>
        </div>
        <h2 className={`${isHidden ? "hidden" : "block"}`}>Guest User</h2>
        </div>
      )
    }
  }
  