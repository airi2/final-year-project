import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './Todo';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const {userId}= useParams()

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === '') {
      alert('Please enter a valid todo');
      return;
    }
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    });
    setInput('');
  };

  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // Update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  return (
    <div className="h-screen d-flex align-items-center justify-content-center bg-gradient">
      <div className="container bg-light rounded p-4 w-75" >

      <div className="navigation d-flex justify-content-center px-4 py-2 mx-5" >
        <Link to= {`/employeedetail/${userId}`} className="btn btn-outline-success btn-sm mx-2 w-">Profile</Link>
        <Link to= {`/employeedetail/${userId}/todo`} className="btn btn btn-outline-success btn-sm mx-2">Tasks</Link>
        <Link to= {`/dashboard/${userId}/login`} className="btn btn btn-outline-success btn-sm">Admin</Link>
      </div>

        <h3 className="text-center font-weight-bold text-primary mb-4"> Activities</h3>
        <form onSubmit={createTodo} className="d-flex mb-3 ">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control mr-2 w-75 mx-2"
            type="text"
            placeholder="Add Todo"
          />
          <button className="btn btn-primary">
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul className="list-group">
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {todos.length < 1 ? null : (
          <p className="text-center mt-3">{`You have ${todos.length} activities `}</p>
        )}
      </div>
    </div>
  );
}

export default AddTodo;
