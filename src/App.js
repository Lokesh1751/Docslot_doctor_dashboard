import React from 'react'
import Login from './pages/Login'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Doctor from './pages/Doctor'
function App() {
  return (
    <div>
     
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/doctor/:id' element={<Doctor/>}/>
     </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
