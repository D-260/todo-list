import { useEffect, useState } from "react";
import Todo from './Todo';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState([]);



  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await fetch("/api/todo-list");
        if (!res.ok) {
          throw new Error(`Error fetching todos: ${res.statusText}`);
        }
        const todos = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    getTodos(); // Call the async function inside useEffect
  }, []); // Empty dependency array means this effect runs once on mount

	const createNewTodo = async(e) => {
		e.preventDefault(); //To prevent page from refreshing and going to defaults on submit 
		if(content.length > 3)
		{
			const res = await fetch("/api/todo-list", {
				method: "POST",
				body: JSON.stringify({ todo: content }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			
			const newTodo = await res.json();
			
			setContent("");
			setTodos([...todos, newTodo]);
		}
	}

  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>
      <form className = "form" onSubmit = {createNewTodo}>
	  <input
	  type = 'text'
	  value = {content}
	  onChange = {(e) => setContent(e.target.value)}
	  placeholder = "Enter a new todo......"
	  className = "form_input"
	  required
	  />
	  <button type = "submit">Create Todo</button>
	  </form>
	  <div className="todos">
         {todos.length > 0 &&
      todos.map((todo) => (
       <Todo key = {todo._id} todo = {todo} setTodos = {setTodos} />
		
          
		  ))}
  </div>
</main>
  );
}