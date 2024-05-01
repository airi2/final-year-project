import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

const style = {
  li: `list-group-item d-flex justify-content-between align-items-center  mr-3 p-4 my-2 text-capitalize`,
  liComplete: `list-group-item d-flex justify-content-between align-items-center bg-light p-4 my-2 text-capitalize`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer text-decoration-line-through`,
  button: `cursor-pointer btn btn-danger d-flex align-items-center`,
};

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input onChange={() => toggleComplete(todo)} type='checkbox' checked={todo.completed ? 'checked' : ''} className="form-check-input" />
        <p onClick={() => toggleComplete(todo)} className={todo.completed ? style.textComplete : style.text}>
          {todo.text}
        </p>
      </div>
      <button onClick={() => deleteTodo(todo.id)} className={style.button}>{<FaRegTrashAlt />}</button>
    </li>
  );
};

export default Todo;
