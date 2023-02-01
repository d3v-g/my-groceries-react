import { useState } from 'react'
import { handleLogIn } from '../api.js'
import { handleRegister } from '../api.js'
import { Navigate } from 'react-router-dom'
import { notify } from '../helpers.js'
import LogInForm from '../forms/LoginForm'
import SignUpForm from '../forms/SignUpForm'

export default function Auth({ userLoggedIn }) {
    const [userLoggingIn, setUserLoggingIn] = useState(true)

    if (userLoggedIn) {
        return <Navigate replace to='/' />
    }
    
    const displayAuthForm = userLoggingIn ?
        <LogInForm
            onSubmit={async (formData) => handleLogIn(formData.email, formData.password)
                ?.then(res => notify(res))} />
        :
        <SignUpForm
            onSubmit={async (formData) => handleRegister(formData.email, formData.password, formData.passwordConf)
                ?.then(res => notify(res))} />

    const displayAuthMsg = userLoggingIn ? 'Sign up for an account' : 'Log in'

    return (
        <div className='container'>
            <div className='auth--form'>
                {displayAuthForm }
                <button className='button--neutral auth--button' onClick={() => setUserLoggingIn(prevState => !prevState)}>
                    {displayAuthMsg}
                </button>
            </div>
        </div>
    )
}