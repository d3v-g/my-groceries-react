import { useForm } from 'react-hook-form'
import searchImg from '../assets/searchImg.png'

export default function SearchItemForm({ submitResponse }) {

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <div>
            <form className='items--search' onSubmit={handleSubmit(formData => submitResponse(formData.name))}>
                <input
                    className='items--search--input'
                    type='text'
                    placeholder='Search for an item'
                    {...register('name')}
                >
                </input>
                <button className='items--search--button' type='submit'>
                    <img src={searchImg} />
                </button>
            </form>
        </div>
    )
}