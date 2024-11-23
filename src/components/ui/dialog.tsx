import * as React from "react";
import {
  Dialog as RadixDialog,
  DialogTrigger as RadixDialogTrigger,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
  DialogDescription as RadixDialogDescription,
  DialogClose as RadixDialogClose,
} from "@radix-ui/react-dialog";

export const Dialog = ({ children }: { children: React.ReactNode }) => {
  return <RadixDialog>{children}</RadixDialog>;
};

export const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixDialogTrigger className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200">
      {children}
    </RadixDialogTrigger>
  );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixDialogContent
      className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 transform transition-all duration-300"
    >
      {children}
    </RadixDialogContent>
  );
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixDialogTitle className="text-2xl font-semibold text-gray-800">
      {children}
    </RadixDialogTitle>
  );
};

export const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixDialogDescription className="text-gray-600 text-sm">
      {children}
    </RadixDialogDescription>
  );
};

export const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end space-x-4 mt-4">
      {children}
    </div>
  );
};

// Optional: Close button for closing the dialog
export const DialogClose = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixDialogClose className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-200">
      {children}
    </RadixDialogClose>
  );
};
