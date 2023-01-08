import { useRef, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Navigate } from 'react-router-dom'

export default function Auth({userLoggedIn}) {
    // e.g.: password must be 16 chars long and contains alphabets, username is taken
    const [alertText, setAlertText] = useState('')
    const [authType, setAuthType] = useState('')
    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const passwordConfRef = useRef()
    
    const handleSubmit = async (type) => {
        const email = emailRef.current?.value
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const passwordConf = passwordConfRef.current?.value;
        setAuthType(type)
        if (type === 'REGISTER') {
            await handleRegister(email, username, password, passwordConf)
        } else if (type === 'LOGIN') {
            await handleLogIn(email, username, password)
        } else {
            setAlertText('Don\'t mess with my website')
        }
    }

    async function handleLogIn(email, username, password) {
        let usernameIsValid = false
        // check if username is in profile database
        const { data } = await supabase.from('profiles')
            .select()
            .eq('username', username)
        
            if (data[0] != null) {
            usernameIsValid = true
        }

        if (usernameIsValid) {
            try {
                const { error } = await supabase.auth.signInWithOtp({ email })
                if (error) {
                    throw error
                }
                setAlertText('Check your email for the login link!')
            } catch (error) {
                setAlertText(error?.error_description || error?.message)
            }
            // sign in with password throws password breach error on Chrome, temporarily aborted
            // try {
            //     const { user, error } = await supabase.auth.signInWithPassword({ email, password })
            //     if (!user || error) 
            //         {throw error}
            // } catch (error) {
            //     setAlertText(error?.error_description || error?.message)//error.error_description || error?.message
            // }
        } else setAlertText('Invalid username')
    }

    async function handleRegister(email, username, password, passwordConf) {
        if (password === passwordConf) {
            try {
                const { user, error } = await supabase.auth.signUp({ 
                    email, 
                    password, 
                    options: {data: { 'username': username, 'email': email} }})
                
                if (!user || error) {
                    throw error
                } else 
                    setAlertText('please check your email for a verification link')
            } catch {
                setAlertText(error?.error_description || error?.message)
            }
        }
        else if (passwordConf && password)
            setAlertText('passwords do not match')
    }
    
    if (userLoggedIn) {
        return <Navigate replace to='/' />
    } else {
        return (
            <div className='container'>
                <p className='auth--alertText'>{alertText}</p>
                <button className='auth--button' onClick={() => setAuthType('LOGIN')}>
                    Log in</button>
                <p>Don't have an account? Sign up now</p>
                <button className='auth--button' onClick={() => handleSubmit('REGISTER')}>
                    Sign up</button>
                <label className='auth--question' htmlFor='username'>
                    Enter your user name:
                </label>
                <input className='auth--input' type='text' name='username' ref={usernameRef} required />
                <label className='auth--question' htmlFor='email'>
                    Enter your email:
                </label>
                <input className='auth--input' type='email' name='email' ref={emailRef} required />
                <label className='auth--question' htmlFor='password'>
                    Enter your password:
                </label>
                <input className='auth--input' type='password' name='password' ref={passwordRef} required />
                {authType === 'REGISTER' &&
                    <>
                        <label className='auth--question' htmlFor='passwordConf'>
                            Confirm your password:
                        </label>
                        <input className='auth--input' type='password' name='passwordConf' ref={passwordConfRef} required />
                    </>
                }
                <div className='auth--buttons'>
                    <button className='auth--button' onClick={() => handleSubmit('LOGIN')}>
                        {authType === 'LOGIN' ? "login" : 'submit'}</button>
                </div>
            </div>
        )
    }
}