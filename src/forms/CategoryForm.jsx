import { useForm } from "react-hook-form"
import { useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function CategoryForm({ initialData, onClose, user_id, mode }) {
    
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (formData) => {
        const name = formData.name.trim()
        let data = null, error = null
        if(mode === 'add') {
             ({ data, error } = await supabase
               .from('categories')
               .insert({ name, user_id })
               .select())
        } else {
             ({ data, error } = await supabase
                .from('categories')
                .update({ name })
                .eq('id', initialData.id)
                .select())
        }
        if (data) {
            onClose({canceled: false, data})
        } else console.error(error)
    }
    
    function handleKeyDown(event) {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            handleSubmit(onSubmit)
        }
        else if (event.code === 'Escape') {
            onClose({canceled: true, data: null})
        }
    }

    useEffect(() => {        
        document.addEventListener('keydown', handleKeyDown)
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div>
            <form className='modal--form' onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor='name' className='form--question'>
                    {mode === 'add' ? 'Enter an category:' : 'Edit category'}
                </label>
                <input
                    className='form--input'
                    type='text'
                    placeholder='e.g. food'
                    defaultValue={initialData?.name}
                    {...register("name", { required: true, maxLength: 20 })} 
                />
                {errors.name?.type === 'required' && <p role="alert">Category name is required</p>}
                {errors.name?.type === 'maxLength' && <p role="alert">Maximum category length is 20</p>}

                <div className='form--buttons'>
                    <button className='button--green' type='submit'>Submit</button>
                    <button className='button--red' onClick={() => onClose({canceled: true, data: null})}>Cancel</button>
                </div>
                

            </form>
        </div>
    )
}