import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, } from "firebase/firestore";

function EmployeeDetail() {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const [currentEmployee, setEmployee] = useState([]);
  

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
      if (userId) {
        const docRef = doc(db, "employees", userId);  // Reference specific doc
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists) {
          setEmployee(docSnap.data()); // Update state with current user data
         
        } else {
          // Handle case where document doesn't exist
          console.log("No such document!");
        }
      }
    };

    fetchCurrentEmployee();
  }, [userId]); 
   
  const handleLogout = () => {
    signOut(auth)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="user-profile container-fluid bg-light">
      <div className="profile-content d-flex flex-column align-items-center mt-3 ">
        <div className="navigation d-flex justify-content-around px-3 py-2 mb-3 " >
          <Link to={`/employeedetail/${userId}`} className="btn btn-outline-success btn-sm mx-2">Profile</Link>
          <Link to={`/employeedetail/${userId}/todo`} className="btn btn btn-outline-success btn-sm mx-2">Tasks</Link>
          <Link to= {`/dashboard/${userId}/login`} className="btn btn btn-outline-success btn-sm">Admin</Link>
        </div>
        <div className="personal-details d-flex flex-column align-items-center mt-5">
          <h2>Personal Details</h2>
          {currentEmployee && (
            <div className="detail">
              <h3>Name: {currentEmployee.name || "-"}</h3>
              <h3>Email: {currentEmployee.email || "-"}</h3>
              <h3>Phone Number: {currentEmployee.phoneNumber || "-"}</h3>
              <h3>Salary: {currentEmployee.salary || "-"}</h3>
              <h3>Role: {currentEmployee.category || "-"}</h3>
            </div>
          )}
        </div>
        <div className="actions d-flex justify-content-center mt-3">
          <Link to={`/employeedetail/${userId}/editprofile`} className="btn btn-primary btn-sm me-2">Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default EmployeeDetail;
