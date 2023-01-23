import { useState } from 'react'
import { handleLogIn } from '../api.js'
import { handleRegister } from '../api.js'
import { Navigate } from 'react-router-dom'
import LogInForm from '../forms/LoginForm'
import SignUpForm from '../forms/SignUpForm'

export default function Auth({userLoggedIn}) {
    const [alertText, setAlertText] = useState('')
    const [userLoggingIn, setUserLoggingIn] = useState(true)

    if (userLoggedIn) {
        return <Navigate replace to='/' />
    } else {
        return (
            <div className='container'>
                {alertText && <p className='alertText' role='alert'>{alertText}</p>}
                <div className='auth--form'>
                    {userLoggingIn
                            ? 
                                <LogInForm 
                                    onSubmit={async (formData) =>
                                        handleLogIn(formData.email, formData.password)
                                            ?.then(alert => setAlertText(alert))}
                                />
                            :
                                <SignUpForm 
                                    onSubmit={async (formData) => 
                                        handleRegister(formData.email, formData.password, formData.passwordConf)
                                            ?.then(alert => setAlertText(alert))} 
                                />
                    }
                        <button className='button--neutral auth--button' onClick={() => setUserLoggingIn(prevState => !prevState)}>
                            {userLoggingIn ? 'Sign up for an account' : 'Log in'}
                        </button>

                </div>
            </div>
        )
    }
}