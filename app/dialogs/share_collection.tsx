import { Copy, Share2 } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogCloseButton({ collectionId }: { collectionId: string }) {

    //* copy the link to the collection
   async function copyText(){
                // Copy text to clipboard using Clipboard API
                await navigator.clipboard.writeText(`http://localhost:3000/collection?collectionId=${collectionId}`);
    }


  return (
    <Dialog>
      <DialogTrigger asChild>
      <div
        onClick={() => {}}
        className=" cursor-pointer bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full p-2  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Share2 size={18} />
    </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`http://localhost:3000/collection?collectionId=${collectionId}`}
              readOnly
            />
          </div>
                  <Button
                      onClick={() => copyText()}
                      type="submit" id="copy-btn" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
