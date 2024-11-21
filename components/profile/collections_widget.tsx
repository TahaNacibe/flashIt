import { FolderPlusIcon } from "lucide-react"

export default function CollectionsWidget() {
    return (
        <div className="w-full p-2 pt-4">


            {/* create widget */}
            <div className="border border-solid rounded-2xl py-5 px-6 flex justify-between cursor-pointer">
                <h1 className="text-lg font-medium"> create a new Collection</h1>
                <FolderPlusIcon />
            </div>

           
        </div>
    )
}