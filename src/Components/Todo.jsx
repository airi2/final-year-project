import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';



const style = {
  li: `list-group-item d-flex justify-content-between align-items-center  mr-3 p-4 my-2 text-capitalize`,
  liComplete: `list-group-item d-flex justify-content-between align-items-center bg-light p-4 my-2 text-capitalize`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer text-decoration-line-through`,
  button: `cursor-pointer btn btn-danger d-flex align-items-center`,
};




const Todo = ({ todo, toggleComplete, deleteTodo, date}) => {
  const {userId} = useParams();
  const admin = "prClI2009UembbKCpe2pvLCcOwy1"
  let todoDate = null;
  let todoDateTime = "";
  if (date instanceof Timestamp) {
    // Convert Firestore timestamp to JavaScript Date object
    todoDate = date.toDate();
     // Format date and time
    todoDateTime = todoDate.toLocaleString();
  }


  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input
          onChange={() => (userId === admin ? toggleComplete(todo) : null)}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
          className="form-check-input"
        />
        <p
          onClick={() => (userId === admin ? toggleComplete(todo) : null)}
          className={todo.completed ? style.textComplete : style.text}
        >
          {todo.text} <br/> Created: {todoDateTime || ""} <br/> 
          {todo.completed && todo.completedAt ? `Completed: ${todo.completedAt.toDate().toLocaleString()}` : ""}
        </p>
      </div>
      <button onClick={() => deleteTodo(todo.id)} className={style.button}>
        <FaRegTrashAlt />
      </button>
    </li>
  );
};


export default Todo;
