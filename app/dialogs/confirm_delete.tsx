import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  title: string;
    itemName: string;
  itemType: string;
  deleteCase: boolean;
  trigger: React.ReactNode;
  onConfirm: () => void;
  description?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  title = "Are you sure?",
  itemName,
    trigger,
  itemType,
  deleteCase,
  onConfirm,
}) => {
  console.log("--------> ",itemName)
  return (
    <AlertDialog>

      {/* the trigger is the widget that will show the dialog box */}
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>

      {/* the content of the dialog box */}
      <AlertDialogContent className="">
        <AlertDialogHeader>
          {/* title */}
          <AlertDialogTitle>
                      {title}
          </AlertDialogTitle>
          {/* description */}
          <AlertDialogDescription>
            {deleteCase
              ? (<>
              This action cannot be undone. This will permanently delete your {itemType} &apos;{(<strong>{itemName}</strong>)}&apos;  and remove it from our servers
              </>)
            : 'would you like to sign out of your account'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* button */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteCase? "Delete" : "Log Out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;