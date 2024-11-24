import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { CircleCheck, FolderPlusIcon, Pencil } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { COLORS } from "@/app/data/standard_data"
import { Button } from "../ui/button"

//* create a new collection dialog
export function ManageCollectionData({ userId, onAddAction, isEdit, item }: { userId: string, onAddAction: any, isEdit:boolean, item:any | null}) {
    //* vars to manage the state
    const [collectionName, setCollectionName] = useState("")
    const [collectionDesc, setCollectionDesc] = useState("")
    const [selectedColor, setSelectedColor] = useState("blue")

    //* handle the post request to create a collection
    const createANewCollectionInTheDataBase = async () => {
        const response = await fetch("/api/connection/collections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({title:collectionName, colorKey:selectedColor, description:collectionDesc ,ownerId:userId}),
        })

        if (response.ok) {
            const data = await response.json()
            setCollectionName("")
            //* update the list the user currently have
            onAddAction(data.card)
        }
    }

        //* update existing collection 
    const updateAnExistingCollectionBasedOnItsId = async (itemId: string) => {
        //* if a required item is missing exit the function 
        if (!itemId || collectionName == "") {
                return;
        }
        //* else get the data 
            const response = await fetch(`/api/connection/collections?id=${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({title:collectionName, colorKey:selectedColor, description:collectionDesc}),
            })
            if (response.ok) {
                const data = await response.json()
                //* update the user list of collection too
                onAddAction(data.collection)
            }
        }

    
    //* apply the changes the user did on the list he currently have 
    const updateDataForEdit = () => {
        if (item) {
            setCollectionName(item.title)
            setCollectionDesc(item.description ?? "")
            setSelectedColor(item.colorKey)
        }
    }

    //* clear fields when dialog open
    const clearAllFieldsOnDialogOpen = () => {
        setCollectionName("")
        setCollectionDesc("")
    }


    //* get the correct trigger for each case use
    const TriggerButton = () => {
        if (isEdit) {
            //* edit case buttons 
            return (<div
                onClick={() => updateDataForEdit()}
                className=" bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full p-2  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Pencil size={18} />
            </div>)
        } else {
            //* new item button
           return( <div
            onClick={() => clearAllFieldsOnDialogOpen()}
            className="border border-solid rounded-2xl py-5 px-6 flex justify-between cursor-pointer gap-4">
        <h1 className="text-lg font-medium"> create a new Collection</h1>
        <FolderPlusIcon />
    </div>)
    }
    }



    //* ui tree
    return (
        <Dialog>
        {/* the button that open the dialog */}
            <DialogTrigger>
                <TriggerButton />
            </DialogTrigger>
            
        {/* dialog content */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
                    <DialogTitle>{isEdit
                        ? "Update Collection"
                        : "New Collection"}</DialogTitle>
            <DialogDescription>
                        {isEdit
                            ? "Update a collection details to keep it fresh and unique"
                            : " Create a collection to gather similar flash cards together"}
            </DialogDescription>
                </DialogHeader>

        {/* collection name field */}
          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
            <Input
                onChange={(e) => setCollectionName(e.target.value)}
                id="name" value={collectionName} className="col-span-3" />
            </div>
                </div>

        {/* collection description field */}
          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
            <Input
                onChange={(e) => setCollectionDesc(e.target.value)}
                id="name" value={collectionDesc} className="col-span-3" />
            </div>
                </div>

                {/* color selector */}
                <Label htmlFor="colorSelector" className="text-left text-lg">
                select a color
              </Label>
                <div className="flex gap-2" id="colorSelector">
                {COLORS.map((colorItem, index) => (
                    <div
                        onClick={() => setSelectedColor(colorItem.label)}
                        className={`rounded-full w-full h-9 flex justify-center items-center 
                        ${colorItem.color}  
                        ${selectedColor === colorItem.label ? "ring-2 ring-black dark:ring-gray-700" : ""}`}
                        key={index.toString()}>
                        {selectedColor === colorItem.label && (<CircleCheck size={15} className="dark:text-black" />)}
                        </div>
                ))}
                </div>
                
        {/* submit button */}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            disabled={collectionName === ""}
                            onClick={() => (isEdit
                                ? updateAnExistingCollectionBasedOnItsId(item._id,)
                                : createANewCollectionInTheDataBase())}
                            type="submit">{isEdit
                                ? "Update collection"
                                : "Create collection"}</Button>
                    </ DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }