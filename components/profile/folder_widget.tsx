import React from 'react';
import { FolderClosed, GalleryHorizontalEnd, Trash2Icon, Pencil } from 'lucide-react';
import DeleteConfirmationDialog from '@/app/dialogs/confirm_delete';
import { ManageCollectionData } from './edit_collection';
import Link from 'next/link';

//* the icons size for the collections widget 
const ICON_SIZE = 18

const FolderCard = ({ collection, getTheBgColorForTheCollectionFromTheMapList, onDeleteAction, onEditAction, userId, canEdit = true }
    : { collection: any, getTheBgColorForTheCollectionFromTheMapList: any,onDeleteAction: any, onEditAction: any,userId:string, canEdit:boolean }) => {
    return (
    <div 
      className={`relative border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-4 hover:shadow-lg transition-all duration-300 group overflow-hidden
        ${getTheBgColorForTheCollectionFromTheMapList(collection.colorKey)}
      `}
    >
      {/* Folder Tab Effect */}
      <div 
        className="absolute top-0 left-0 w-full h-8 bg-white dark:bg-black border-b  border-gray-200 dark:border-gray-700 rounded-t-xl shadow-sm transform origin-top group-hover:-translate-y-1 transition-transform duration-300"/>

      {/* Card Content */}
        <div className="relative z-10 space-y-3">
          <Link href={`/collection?collectionId=${collection._id}`}>
            <div className="flex items-center justify-between">
              <div>
          <h2 className="text-lg font-medium text-black flex items-center gap-2">
                      <div className={`text-white dark:text-black rounded-full p-4 ${getTheBgColorForTheCollectionFromTheMapList(collection.colorKey)}`}>
                      <FolderClosed size={ICON_SIZE} />
                      </div>
          </h2>
              <div className='pl-2 dark:text-black text-lg'>
              {collection.title}
            </div>
              <p className='text-gray-300 px-4 line-clamp-1'>
                {collection.description}
              </p>
              </div>
                
        </div>
          </Link>

        <div className="flex items-center justify-between">
          <h3 className="text-gray-600 text-base bg-white dark:bg-black dark:text-white rounded-full px-2 py-1 flex gap-2 items-center">
                        {collection.collection_cards?.length || 0}
                        <GalleryHorizontalEnd size={ICON_SIZE} /> 
          </h3>
            {canEdit && <div className="flex items-center space-x-2">
              {/* add a new collection dialog */}
              <ManageCollectionData
                userId={userId}
                isEdit={true}
                item={collection}
                onAddAction={(newItem: any) => onEditAction(newItem)} />
              
              {/* show the confirm dialog for delete */}
              <DeleteConfirmationDialog
                title={'Are you sure?'}
                deleteCase={true}
                itemName={collection.title}
                itemType={'collection'}
                trigger={DeleteButton()}
                onConfirm={() => onDeleteAction(collection._id)} />
          </div>}
        </div>
      </div>
    </div>
  );
};

//* widget that will trigger the delete dialog
const DeleteButton = () => {
    return (
      <button
            className=" bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Trash2Icon size={ICON_SIZE} />
            </button>
    )
}

export default FolderCard