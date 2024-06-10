"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import CreateEditTodo from "./todo/CreateEditTodo";
import DeleteTodo from "./todo/DeleteTodo";

const ActionsOptions = ({
  todo,
  isEditing,
}: {
  todo: any;
  isEditing?: boolean;
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsCreateDialogOpen(true)} variant={"ghost"}>
        <Pencil className="size-4" />
      </Button>
      <Button onClick={() => setIsDeleteDialogOpen(true)} variant={"ghost"}>
        <Trash className="size-4" />
      </Button>
      <CreateEditTodo
        todo={todo}
        isEditing={true}
        isDialogOpen={isCreateDialogOpen}
        setIsDialogOpen={setIsCreateDialogOpen}
      />
      <DeleteTodo
        id={todo.id}
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />
    </>
  );
};

const ShowTodos = ({ data }: { data: any[] }) => {
  const [client, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    client && (
      <>
        <div className="w-full my-5">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-2xl">Todos</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="size-4 mr-1" /> Add Todo
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="!text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{record.title}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell className="text-center">
                    <ActionsOptions todo={record} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p>No data found</p>
            )}
          </TableBody>
        </Table>
        <CreateEditTodo
          isEditing={false}
          isDialogOpen={isCreateDialogOpen}
          setIsDialogOpen={setIsCreateDialogOpen}
        />
      </>
    )
  );
};

export default ShowTodos;
