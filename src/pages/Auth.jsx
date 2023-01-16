import { useState } from 'react'
import { handleLogIn } from '../api.js'
import { handleRegister } from '../api.js'
import { Navigate } from 'react-router-dom'
import LogInForm from '../forms/LoginForm'
import SignUpForm from '../forms/SignUpForm'

export default function Auth({userLoggedIn}) {
    const [alertText, setAlertText] = useState('')
    const [authType, setAuthType] = useState(null)

    if (userLoggedIn) {
        return <Navigate replace to='/' />
    } else {
        return (
            <div className='container'>
                {alertText && <p className='alertText' role='alert'>{alertText}</p>}
                <div className='auth--buttons'>
                    <div>
                        <p className='form--question'>Already have an account?<br/> Log in:</p>
                        <button className='button--neutral' onClick={() => setAuthType('LOGIN')}>
                            Log in
                        </button>
                    </div>
                    <div>
                        <p className='form--question'>Sign up for an account:</p>
                        <button className='button--neutral' onClick={() => setAuthType('SIGNUP')}>
                            Sign up
                        </button>
                    </div>
                </div>
                {authType != null && 
                    (authType === 'LOGIN'
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
                    )
                }
            </div>
        )
    }
}