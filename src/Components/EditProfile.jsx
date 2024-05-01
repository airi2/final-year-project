import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link} from 'react-router-dom';
import {updateDoc, doc, getDoc} from "firebase/firestore";
import { db } from '../firebase';

function EditProfile() {
	const [data, setData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        
    });
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'employees', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error getting document:', error);
            }
        };

        fetchData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const employeeData = {
            // Extract employee data from form fields
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
        };
        try {
            // Update employee data in Firestore
            await updateDoc(doc(db, 'employees', userId), employeeData);
            navigate(`/employeedetail/${userId}`);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Update Employee  Detail</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label htmlFor="inputName" className="form-label">Name</label>
					<input type="text" 
                    className="form-control"
                     id="inputName" 
                     placeholder='Enter Name' 
                     autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})} 
					value={data.name}/>
				</div>
				<div class="col-12">
					<label htmlFor="inputEmail4" 
                    className="form-label">Email</label>
					<input type="email" 
                    className="form-control" 
                    id="inputEmail4" 
                    placeholder='Enter Email'
                    autoComplete='off'
					onChange={e => setData({...data, email: e.target.value})} 
                    value={data.email}/>
				</div>
				<div class="col-12">
					<label htmlFor="phoneNumber" className="form-label">PhoneNumber</label>
					<input type="text"
                     className="form-control"
                      id="inputAddress" 
                      placeholder="0725667788" 
                      autoComplete='off'
					onChange={e => setData({...data, phoneNumber: e.target.value})} 
                    value={data.phoneNumber}/>
				</div>
				<div class="col-12">
					<button type="submit" className="btn btn-primary">Update</button>
                    <Link to={`/employeedetail/${userId}`} className="btn btn-danger btn-sm mx-3 me-2">Cancel</Link>
				</div>
			</form>
		</div>
  )
}

export default EditProfile;