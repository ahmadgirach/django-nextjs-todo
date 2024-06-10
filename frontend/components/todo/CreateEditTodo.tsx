"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import ShowError from "../shared/ShowError";
import { Textarea } from "../ui/textarea";

const CreateEditTodo = ({
  todo,
  isEditing,
  isDialogOpen,
  setIsDialogOpen,
}: {
  todo?: any;
  isEditing?: boolean;
  isDialogOpen?: boolean;
  setIsDialogOpen?: (value: boolean) => void;
}) => {
  const [error, setError] = useState<any>("");
  const [isPending, startTransition] = useTransition();
  const { push, refresh } = useRouter();
  const pathname = usePathname();

  const success = () => {
    setIsDialogOpen?.(false);
    push(pathname);
    refresh();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setError("");

    try {
      startTransition(async () => {
        if (isEditing) {
          const response = await fetch(
            `http://localhost:8000/todos/edit/${todo.id}`,
            {
              method: "PUT",
              body: JSON.stringify(data),
            }
          );
          if (!response.ok) {
            setError(response.statusText);
            return;
          } else {
            success();
          }
        } else {
          const response = await fetch("http://localhost:8000/todos/create", {
            method: "POST",
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            setError(response.statusText);
            return;
          } else {
            success();
          }
        }
        form.reset();
      });
    } catch (error: unknown) {
      setError(error);
    }
  };

  const FormSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required!",
    }),
    description: z.string().max(200, {
      message: "Description can not be longer than 200 chars.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: isEditing ? todo.title : "",
      description: isEditing ? todo.description : "",
    },
  });

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open: boolean) => {
        setIsDialogOpen?.(open);
        form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit ToDo" : "Create ToDo"}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit">
                {isPending
                  ? isEditing
                    ? "Saving changes..."
                    : "Creating ToDo..."
                  : isEditing
                  ? "Save changes"
                  : "Create ToDo"}
              </Button>
            </form>
          </Form>
        </div>
        {error && <ShowError error={error} />}
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditTodo;
