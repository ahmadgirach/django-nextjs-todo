import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const DeleteTodo = ({
  id,
  isDialogOpen,
  setIsDialogOpen,
}: {
  id: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const { push, refresh } = useRouter();
  const pathname = usePathname();

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Record will permanantly be deleted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
            onClick={() =>
              startTransition(async () => {
                const response = await fetch(
                  `http://localhost:8000/todos/delete/${id}`,
                  {
                    method: "DELETE",
                  }
                );
                if (response.ok) {
                  push(pathname);
                  refresh();
                }
              })
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTodo;
