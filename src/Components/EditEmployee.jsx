import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc , updateDoc} from "firebase/firestore";
import { db } from '../firebase';

function EditEmployee() {
    const [data, setData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        salary: '',
        category: ''
    });
    const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] = useState('');
    const [emailValidationMessage, setEmailValidationMessage] = useState('');
    const [salaryValidationMessage, setSalaryValidationMessage] = useState('');
    const navigate = useNavigate();
    const { userId } = useParams();

    const handlePhoneNumberChange = (event) => {
        const newPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digits
        
        // Validate phone number length
        const isValidLength = newPhoneNumber.length === 10;
        setPhoneNumberValidationMessage(isValidLength ? '' : 'Please enter a 10-digit phone number.');
    
        setData(prevData => ({
            ...prevData,
            phoneNumber: newPhoneNumber
        }));
    };
    
    const handleEmailChange = async (event) => {
        const newEmail = event.target.value;
    
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
    
        setData(prevData => ({
            ...prevData,
            email: newEmail
          }));
    
        setEmailValidationMessage(validationMessage);
    };

    const handleSalaryChange = (event) => {
        const newSalary = event.target.value.replace(/\D/g, ''); // Remove non-digits
    
        // Validate salary format (only digits)
        const isValidFormat = /^\d+$/.test(newSalary);
        setSalaryValidationMessage(isValidFormat ? '' : 'Please enter digits only.');
    
        // Format the salary with currency formatting
        const formattedSalary = newSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        setData(prevData => ({
          ...prevData,
          salary: formattedSalary
        }));
    }

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
            salary: data.salary,
            category: data.category
        };
        try {
            // Update employee data in Firestore
            await updateDoc(doc(db, 'employees', userId), employeeData);
            navigate(`/dashboard/${userId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Update Employee</h2>
            <form className="row g-3 w-50" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label htmlFor="inputName" className="form-label"><strong>Name </strong></label>
                    <input type="text"
                        className="form-control"
                        id="inputName"
                        placeholder='Enter Surname Firstname Secondname'
                        autoComplete='off'
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })} />
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
                        value={data.email}
                    />
                    {emailValidationMessage && <p className="text-danger">{emailValidationMessage}</p>} {/* Display validation message conditionally */}
                </div>
                <div className="col-12">
                    <label htmlFor="inputSalary" className="form-label"><strong>Salary (Ksh) </strong></label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputSalary"
                        placeholder="Enter Salary"
                        autoComplete='off'
                        value={data.salary}
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
                        value={data.phoneNumber}
                    />
                    {phoneNumberValidationMessage && <p className="text-danger">{phoneNumberValidationMessage}</p>} {/* Display validation message conditionally */}
                </div>
                <div className="col-12">
                    <label htmlFor="inputCategory" className="form-label"><strong>Category </strong></label>
                    <input type="text"
                        className="form-control"
                        id="inputCategory"
                        placeholder="Enter Category"
                        autoComplete='off'
                        value={data.category}
                        onChange={(e) => setData({ ...data, category: e.target.value })}
                    />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Update</button>
                    <Link to={`/dashboard/${userId}`} className="btn btn-danger btn-sm mx-3 me-2">Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default EditEmployee;
