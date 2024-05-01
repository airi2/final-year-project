import React from 'react'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Employee from './Components/Employee'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import EmployeeDetail from './Components/EmployeeDetail'
import Register from './Components/Register'
import AddTodo from './Components/AddTodo'
import EditProfile from './Components/EditProfile'
import { AuthProvider } from './Components/AuthContext'
import DashboardLogin from './Components/DashboardLogin'


function App() {

  return (
     
    <BrowserRouter>
    <AuthProvider>
    <Routes>
      <Route path='/Register' element={<Register />}></Route>
      <Route path='/' element={<Login />}></Route>
      <Route path='/dashboard/:userId' element={<Dashboard />}>
        <Route path = '/dashboard/:userId/login' element= {<DashboardLogin/>}></Route>
        <Route path='' element={<Employee />}></Route>
        <Route path='/dashboard/:userId/create' element={<AddEmployee />}></Route>
        <Route path='/dashboard/:userId/employeeEdit' element={<EditEmployee />}></Route>
      </Route>
      <Route path= '/employeedetail/:userId' element={<EmployeeDetail />}></Route>
       <Route path='/employeedetail/:userId/todo' element={<AddTodo />}></Route>
       <Route path = '/employeedetail/:userId/editprofile' element={<EditProfile />}></Route> 

    </Routes>
    </AuthProvider>
    </BrowserRouter>
    
  )
}

export default App