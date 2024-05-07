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
  Timestamp
} from 'firebase/firestore';

function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [startDate, setStartDate] = useState('');
 
 
  const {userId}= useParams()
  const currentDate = new Date();
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
      created: currentDate,
    });
    setInput('');
    console.log("Added successfully")
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
    return () => unsubscribe();}

  
  , []);

 // Update todo completion status and timestamp in firebase
const toggleComplete = async (todo) => {
  const updatedCompletedStatus = !todo.completed;
  const updatedCompletedTime = updatedCompletedStatus ? Timestamp.now() : null; // Timestamp.now() gets the current timestamp

  await updateDoc(doc(db, 'todos', todo.id), {
    completed: updatedCompletedStatus,
    completedAt: updatedCompletedTime,
  });
};

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  // Sort todos by completed status and created date
  const sortedTodos = todos.slice().sort((a, b) => {
    // Sort uncompleted todos first
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    // Sort completed todos by created date
    return a.created.toMillis() - b.created.toMillis();
  });
 
  //logout
  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');}

  return (
    <div className="h-screen d-flex align-items-center justify-content-center bg-gradient">
      <div className="container bg-light rounded p-4 w-75" >

      <div className="navigation d-flex justify-content-center px-4 py-2 mx-5" >
        <Link to= {`/employeedetail/${userId}`} className="btn btn-outline-success btn-sm mx-2 w-">Profile</Link>
        <Link to= {`/employeedetail/${userId}/todo`} className="btn btn btn-outline-success btn-sm mx-2">Tasks</Link>
        <Link to= {`/dashboard/${userId}/login`} className="btn btn btn-outline-success btn-sm">Admin</Link>
        <Link to="/" onClick={handleLogout} className='btn btn-danger mx-3'>Logout</Link>
      </div>

        <h3 className="text-center font-weight-bold text-primary mb-4"> Activities</h3>
        <form onSubmit={createTodo} className="d-flex flex-column  mb-3 ">
          <div className="d-flex my-3">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control mr-2 w-75 mx-2 "
            type="text"
            placeholder="Add Todo"/>
          <button className="btn btn-primary">
            <AiOutlinePlus size={30} />
          </button>
          </div>

          <div className="d-flex">
          <input
            className="form-control mr-2 w-75 mx-2 mt-1 py-6 px-12"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {/* <button className="btn btn-primary" onClick={filter()}>Search</button> */}
          </div>
        </form>
        <ul className="list-group">
          {sortedTodos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              date = {todo.created || "-"}
              
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
