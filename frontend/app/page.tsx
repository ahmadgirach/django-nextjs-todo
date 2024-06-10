import ShowTodos from "@/components/ShowTodos";

export default async function Home() {
  const response = await fetch("http://localhost:8000/todos/", {
    cache: "no-cache",
  });
  const todos = await response.json();
  return (
    <main className="flex flex-col items-center justify-center p-24">
      <ShowTodos data={todos} />
    </main>
  );
}
