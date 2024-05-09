import React, { useState, useRef } from 'react'
import { useNavigate, useParams, Link} from 'react-router-dom';
import {db} from '../firebase';
import { collection, addDoc} from "firebase/firestore"; 

const AddEmployee = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [salary, setSalary] = useState('');
	const [category, setCategory] = useState('');
	const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] = useState('');
 	const [emailValidationMessage, setEmailValidationMessage] = useState('');
	const [salaryValidationMessage, setSalaryValidationMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputRef = useRef(null);
   
	const navigate = useNavigate()
	const {userId} = useParams();

	const handlePhoneNumberChange = (event) => {
		const newPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digits
		setPhoneNumber(newPhoneNumber);
	
		// Validate phone number length
		const isValidLength = newPhoneNumber.length === 10;
		setPhoneNumberValidationMessage(isValidLength ? '' : 'Please enter a 10-digit phone number.');
	};
	
	const handleEmailChange = async (event) => {
		const newEmail = event.target.value;
		setEmail(newEmail);
	
		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidFormat = emailRegex.test(newEmail);
	
		let validationMessage = '';
		if (isValidFormat) {
			// Extract domain from email address
			const domain = newEmail.split('@')[1];
	
			// Validate domain using a regular expression
			const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			const isValidDomain = domainRegex.test(domain);
	
			if (!isValidDomain) {
				validationMessage = 'Invalid domain.';
			}
		} else {
			validationMessage = 'Please enter a valid email address.';
		}
	
		setEmailValidationMessage(validationMessage);
	};
		
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSalaryChange = (event) => {
        const newSalary = event.target.value.replace(/\D/g, ''); // Remove non-digits
    
        // Validate salary format (only digits)
        const isValidFormat = /^\d+$/.test(newSalary);
        setSalaryValidationMessage(isValidFormat ? '' : 'Please enter digits only.');
    
        // Format the salary with currency formatting
        const formattedSalary = newSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        setSalary(formattedSalary)
    }

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

	const handleFocus = () => {
		passwordInputRef.current.classList.add('focused'); // Add 'focused' class on focus
	};
	
	const handleBlur = () => {
		passwordInputRef.current.classList.remove('focused'); // Remove 'focused' class on blur
	};

	return (
		<div className='d-flex flex-column align-items-center pt-4'>
			<h2>Add Employee</h2>
			<form className="row g-3 w-50" onSubmit={handleSubmit}>
			<div className="col-12">
					<label htmlFor="inputName"><strong>Name </strong></label>
					<input type="text" className="form-control" id="inputName" placeholder='Enter Full Names' autoComplete='off'
					onChange={(e)=> setName(e.target.value)}  />
				</div>
				<div className="col-12">
					<label htmlFor="email"><strong>Email</strong></label>
					<input
						type="email"
						placeholder='Enter Email'
						name='email'
						onChange={handleEmailChange}  // Use handleEmailChange function
						className='form-control rounded-0'
						autoComplete='off'
					/>
					{emailValidationMessage && <p className="text-danger">{emailValidationMessage}</p>} {/* Display validation message conditionally */}
				</div>
				<div className="col-12">
					<label htmlFor="password"><strong>Password</strong></label>
					<div className="input-group">
					<input
						type={showPassword ? "text" : "password"}
						placeholder='Enter Password'
						name='password'
						onChange={handlePasswordChange}
						className='form-control rounded-0'
						autoComplete='off'
						ref={passwordInputRef} // Assign ref to password input
						onFocus={handleFocus}
						onBlur={handleBlur}
					/>
					<div className="input-group-append">
						<button
						className="btn btn-outline-secondary rounded-0"
						type="button"
						onClick={toggleShowPassword}
						>
						{showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
						</button>
						</div>
						</div>
						<div className={`text-danger ${passwordInputRef.current?.value && passwordInputRef.current?.classList.contains('focused') ? '' : 'd-none'}`}>
						Password must be at least 8 characters and include:
						<ul>
							<li>One lowercase letter (a-z)</li>
							<li>One uppercase letter (A-Z)</li>
							<li>One number (0-9)</li>
							<li>One special character (@$!%*?&)</li>
						</ul>
         			</div>
				</div>
				<div className="col-12">
				<label htmlFor="inputSalary" className="form-label"><strong>Salary (Ksh) </strong></label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputSalary"
                        placeholder="Enter Salary"
                        autoComplete='off'
                        value={salary}
                        onChange={handleSalaryChange} // Use handleSalaryChange function
                    />
                    {salaryValidationMessage && <p className="text-danger">{salaryValidationMessage}</p>} {/* Display validation message conditionally */}
				</div>
				<div className="col-12">
					<label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
					<input
						type="text"
						placeholder='Enter Phone Number'
						name='phoneNumber'
						onChange={handlePhoneNumberChange} // Use handlePhoneNumberChange function
						className='form-control rounded-0'
						autoComplete='off'
					/>
					{phoneNumberValidationMessage && <p className="text-danger">{phoneNumberValidationMessage}</p>} {/* Display validation message conditionally */}
				</div>
				<div className="col-12">
					<label htmlFor="inputCategory"><strong>Category </strong></label>
					<input type="text" className="form-control" id="inputCategory" placeholder="Enter Category" autoComplete='off'
					onChange={(e) => setCategory(e.target.value)} />
				</div>
				<div className="col-12">
					<button type="submit" className="btn btn-primary">Create</button>
					<Link to={`/dashboard/${userId}`} className="btn btn-danger btn-sm mx-3 me-2">Cancel</Link>
				</div>
			</form>
		</div>

	)

}

export default AddEmployee