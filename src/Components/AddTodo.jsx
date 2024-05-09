import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './Todo';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import moment from 'moment';
import './style.css';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore';

function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [startDate,setStartDate]= useState('');
  const [endDate,setEndDate]= useState('');
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);


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

  const handleSearch = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      // Display an error message
      alert("Please select both a start date and an end date. If you want the one particular day choose it in both fields!");
      return; // Prevent further execution of the search operation
    }

  // Parse startDate and endDate using Moment.js
  let parsedStartDate = startDate ? moment(startDate, 'YYYY-MM-DD') : null;
  let parsedEndDate = endDate ? moment(endDate, 'YYYY-MM-DD') : null;

  let filteredTodos = sortedTodos.filter((todo) => {
    // Parse todoDate using Moment.js
    let todoDate = moment(todo.created.toDate());

    // Filter todos based on startDate and endDate
    return (
      (!parsedStartDate || todoDate.isSameOrAfter(parsedStartDate, 'day')) &&
      (!parsedEndDate || todoDate.isSameOrBefore(parsedEndDate, 'day'))
    );
  });

  // Update filtered todos
  setTodos(filteredTodos);
  setIsSearchEmpty(filteredTodos.length === 0);
  // Show reset button when search is performed
  setResetVisible(true);  

  }

  const resetTodos = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, 'todos'));
      const querySnapshot = await getDocs(q);
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
      setIsSearchEmpty(false); // Reset search empty indicator
      setStartDate(''); // Empty startDate input
      setEndDate(''); // Empty endDate input
      setResetVisible(false); // Hide reset button

    } catch (error) {
      console.error('Error resetting todos:', error);
    }
  };

  const dropDown = (e) => {
    e.preventDefault();
    const dropdownContent = document.getElementById("myDropdown");
    if (dropdownContent.style.display === "none" || !dropdownContent.style.display) {
      dropdownContent.style.display = "block";
    } else {
      dropdownContent.style.display = "none";
    }

  }
  //logout
  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

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
          <div className="d-flex flex-column my-3">
           <div className="d-flex flex-column my-2 "> 
           <div className="d-flex ">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control mr-2 w-75 mx-2 "
            type="text"
            placeholder="Add Todo"/>

          <button className="btn btn-primary">
            <AiOutlinePlus size={30} />
          </button> </div>
         
          <div id="select d-flex ">
            <p>Search by:</p>
            <button onClick={dropDown} className="dropbtn"> Created Date</button><br/>
            <div id="myDropdown" className="dropdown-content" style={{ display: "none" }}>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="options mr-2 w-20 mx-2 "
              type="date"
            /> 
            <input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="options mr-2 w-20 mx-2 "
                type="date"
            /> 
            <button className="btn btn-primary" onClick={handleSearch}>Search</button> </div>
          </div>      
            
            </div>
          </div>
        </form>

        {isSearchEmpty ? (
  <p className="text-center mt-3">No activities found for the selected date range.</p>
) : (
  <ul className="list-group">
    {sortedTodos.map((todo, index) => (
      <Todo
        key={index}
        todo={todo}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        date={todo.created || "-"}
      />
    ))}
  </ul>
)}
  {resetVisible && (
  <div className="text-center mt-3">
    <button className="btn btn-secondary" onClick={resetTodos}>Back</button>
  </div>
)}

        {todos.length < 1 ? null : (
          <p className="text-center mt-3">{`You have ${todos.length} activities `}</p>
        )}

      </div>
    </div>
  );
}

export default AddTodo;