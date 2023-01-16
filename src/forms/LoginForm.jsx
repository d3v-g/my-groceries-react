import { useForm } from "react-hook-form"

export default function LogInForm({ onSubmit }) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    return (
        <form className='auth--form' onSubmit={handleSubmit(onSubmit)}>
            <label className='form--question' htmlFor='email'>
                Enter your email:
            </label>
            <input 
                className='form--input' 
                type='email'
                {...register('email', { required: true })}
            />
            <label className='form--question' htmlFor='password'>
                Enter your password:
            </label>
            <input 
                className='form--input' 
                type='password' 
                {...register('password', { required: true })}
            />
            <button className='button--green' type='submit'>
                log in
            </button>
        </form>
    )
}