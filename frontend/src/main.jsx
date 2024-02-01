import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup.jsx'
import Signin from './pages/signin.jsx'
import Dashboard from './pages/dashboard.jsx'
import { AuthProvider } from './AuthProvider.jsx'
import Transfer from './pages/transfer.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/signin' element={<Signin />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/transfer/:id' element={<Transfer />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
)
