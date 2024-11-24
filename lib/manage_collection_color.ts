import { COLORS } from "@/app/data/standard_data"

    //* get the colors for the item difficulty
    const getTheBgColorForTheCollectionFromTheMapList = (key: string) => {
        const colorForTheCard = COLORS.find((colorItem) => colorItem.label === key)
        return colorForTheCard ? colorForTheCard.color : "bg-white"
}
    
export default getTheBgColorForTheCollectionFromTheMapList