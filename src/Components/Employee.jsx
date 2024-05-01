import React, { useEffect, useState } from 'react';
import { Link , useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import './style.css';


function Employee() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const {userId} = useParams();

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      console.log("Deleted Successfully");
     
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = collection(db, "employees");
        const querySnapshot = await getDocs(response);
        let newData = [];

        querySnapshot.forEach(doc => {
          newData = newData.concat({ id: doc.id, ...doc.data() });
        });
        
        setData(newData);
        
        
      };

      fetchData();
    } catch(error) {
      console.error("Error getting documents: ", error);
    }

    
    }, [handleDelete]);
    // const fetchData = async () => {
    //   const response = collection(db, "employees");
    //   const querySnapshot = await getDocs(response);
    //   let newData = [];

    //   querySnapshot.forEach(doc => {
    //     newData = newData.concat({ id: doc.id, ...doc.data() });
    //   });
      
    //   setData(newData);
    //   fetchData();};
    
      
    
  
    const handleLogout = () => {
      signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
  };
 
  

  return (
    <div >
      <div className='d-flex justify-content-between px-5 py-3 align-items-center'>
      <Link to={`/dashboard/${userId}/create`} className='btn btn-success'>Add Employee</Link>
      <div className="navigation d-flex justify-content-around px-3 py-2 mb-3 " >
        <Link to={`/employeedetail/${userId}`} className="btn btn-outline-success btn-sm mx-2">Profile</Link>
        <Link to={`/employeedetail/${userId}/todo`} className="btn btn btn-outline-success btn-sm mx-2">Tasks</Link>
        <Link to={`/dashboard/${userId}/login`} className="btn btn btn-outline-success btn-sm">Admin</Link>
      </div>
      
      <Link to="/" onClick={handleLogout} className='btn btn-danger'>Logout</Link>
      
    </div>

  
    
    <div className='mt-3'>
      <table className='table table-striped table-bordered'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Salary</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee, index) => (
            <tr key={index}>
              <td>{employee.email || '-'}</td>  {/* Display '-' for empty email */}
              <td>{employee.name || '-'}</td>  {/* Display '-' for empty name */}
              <td>{employee.phoneNumber || '-'}</td> {/* Display '-' for empty phone number */}
              <td>{employee.salary || '-'}</td>  {/* Display '-' for empty salary */}
              <td>{employee.category || '-'}</td> {/* Display '-' for empty category */}
              <td>
                <Link to={`/dashboard/${employee.id}/employeeEdit`} className='btn btn-primary btn-sm me-2'>Edit</Link>
                <button onClick={(e) => handleDelete(employee.id)} className='btn btn-sm btn-danger'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );  
}

export default Employee;

