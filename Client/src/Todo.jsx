import React from 'react';
export default function Todo(props) { 
	const{todo, setTodos} = props;
	
	const updateTodo = async (todoId, todoStatus) => {

		const res = await fetch(`/api/todo-list/${todoId}`, {
				method: "PUT",
				body: JSON.stringify({ status: todoStatus }),
				headers: {
					"Content-Type": "application/json"
				},
			});
		    console.log("Response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
	  
		const json = await res.json();
		if(json.acknowledged){
			setTodos(currentTodos => {
				return currentTodos.map((currentTodo) => {
					if(currentTodo._id === todoId){
						return { ...currentTodo, status: !currentTodo.status};
					}
					return currentTodo;
				});
			});
		}
		else {
      console.error("Failed to update todo");
    }
	
	};
				
	const deleteTodo = async (todoId) => {
		
		const res = await fetch(`/api/todo-list/${todoId}`, {
			method: "DELETE"
		});
		
		 console.log("Response status:", res.status);
		const json = await res.json();
		if(json.acknowledged) {
			setTodos(currentTodos => {
				return currentTodos
				.filter((currentTodo) => (currentTodo._id !== todoId));
			})
		}
	};

	
	return(
		<div key = {todo._id} className = "todo">
			<p>{todo.todo}</p>
			<div>
				<button className = "todo_status"
				onClick={() => updateTodo(todo._id, todo.status)}				
				>
				
					{(todo.status) ? "✔" : " "}
					
				</button>
				
				<button
					className= "todo_delete"
					onClick={() => deleteTodo(todo._id)}
					
				>
				🗑️
				</button>
			</div>
		</div>
	)
}