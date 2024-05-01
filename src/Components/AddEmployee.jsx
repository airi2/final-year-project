import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {db} from '../firebase';
import { collection, addDoc, doc, getDoc} from "firebase/firestore"; 

const AddEmployee = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [salary, setSalary] = useState('')
	const [category, setCategory] = useState('')	
	
	
	const navigate = useNavigate()
	const {userId} = useParams();

	
	
	const handleSubmit = async(e) => {
		e.preventDefault();

		const employeeData = {
			//Extract employee data from form fields
			name,
			email,
			password,
			phoneNumber,
			salary,
			category
		  }
		
		  try {
			// Add employee data to Firestore
			await addDoc(collection(db, "employees"), employeeData);
			
			// Handle success (e.g., clear form, show success message)
			console.log('Employee added successfully!');
			// ... (reset form, show success UI)
			navigate(`/dashboard/${userId}`)
		  } catch (error){
            console.log(error);
			
		  }
	}
	return (
		<div className='d-flex flex-column align-items-center pt-4'>
			<h2>Add Employee</h2>
			<form className="row g-3 w-50" onSubmit={handleSubmit}>
			<div className="col-12">
					<label htmlFor="inputName" >Name</label>
					<input type="text" className="form-control" id="inputName" placeholder='Enter Full Names' autoComplete='off'
					onChange={(e)=> setName(e.target.value)}  />
				</div>
				<div className="col-12">
					<label htmlFor="inputEmail4" >Email</label>
					<input type="email" className="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
					onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div className="col-12">
					<label htmlFor="inputPassword4">Password</label>
					<input type="password" className="form-control" id="inputPassword4" placeholder='Enter Password'
					 onChange={(e) => setPassword( e.target.value)} />
				</div>
				<div className="col-12">
					<label htmlFor="inputSalary">Salary</label>
					<input type="text" className="form-control" id="inputSalary" placeholder="Enter Salary" autoComplete='off'
					onChange={(e) => setSalary(e.target.value)} />
				</div>
				<div className="col-12">
					<label htmlFor="inputPhoneNumber">Phone Number</label>
					<input type="text" className="form-control" id="inputPhoneNumber" placeholder="0722222220" autoComplete='off'
					onChange={(e) => setPhoneNumber(e.target.value)} />
				</div>
				<div className="col-12">
					<label htmlFor="inputCategory">Category</label>
					<input type="text" className="form-control" id="inputCategory" placeholder="Enter Category" autoComplete='off'
					onChange={(e) => setCategory(e.target.value)} />
				</div>
				<div className="col-12">
					<button type="submit" className="btn btn-primary">Create</button>
				</div>
			</form>
		</div>

	)

}

export default AddEmployee