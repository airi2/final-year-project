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
                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input type="text"
                        className="form-control"
                        id="inputName"
                        placeholder='Enter Surname Firstname Secondname'
                        autoComplete='off'
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="col-12">
                    <label htmlFor="inputEmail4"
                        className="form-label">Email</label>
                    <input type="email"
                        className="form-control"
                        id="inputEmail4"
                        placeholder='Enter Email'
                        autoComplete='off'
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputSalary" className="form-label">Salary</label>
                    <input type="text"
                        className="form-control"
                        id="inputSalary"
                        placeholder="Enter Salary"
                        autoComplete='off'
                        value={data.salary}
                        onChange={(e) => setData({ ...data, salary: e.target.value })}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputPhoneNumber" className="form-label">Phone Number</label>
                    <input type="text"
                        className="form-control"
                        id="inputPhoneNumber"
                        placeholder="0725667788"
                        autoComplete='off'
                        value={data.phoneNumber}
                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputCategory" className="form-label">Category</label>
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
