import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { addItem, updateItem } from '../api'

export default function ItemForm({initialData, onClose, mode}) {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (formData) => {
        const name = formData.name.trim()
        const note = formData.note.trim()
        const price = formData.price
        mode === 'add'
            ?
            addItem(name, price, note, initialData.parent_category_id)
                .then(data => onClose({canceled: false, data}))
            :
            updateItem(name, price, note, initialData.id)
                .then(data => onClose({canceled: false, data}))
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
                    {mode === 'add' ? 'Enter an item:' : 'Edit item'}
                </label>
                <input
                    className='form--input'
                    type='text'
                    placeholder='e.g. apple'
                    defaultValue={initialData?.name}
                    {...register("name", { required: true, maxLength: 20 })} 
                />
                {errors.name?.type === 'required' && <p role="alert">Item name is required</p>}
                {errors.name?.type === 'maxLength' && <p role="alert">Maximum item length is 20 characters</p>}
                <label htmlFor='price' className='form--question'>
                    Add item price:
                </label>
                <input 
                    className='form--input'
                    type='number'
                    step='0.5'
                    defaultValue={initialData?.price ?? 0}
                    {...register('price', { valueAsNumber: true, required: true })}
                />
                {errors.price?.type === 'valueAsNumber' && <p role="alert">Item price must be a number</p>}
                {errors.price?.type === 'required' && <p role="alert">Item price is required</p>}

                <label htmlFor='note' className='form--question'>
                    Add an optional note:
                </label>
                <input
                    className='form--input'
                    type='text'
                    placeholder='e.g. pack of 4'
                    defaultValue={initialData?.note}
                    {...register('note', { maxLength: 40 })}
                />
                {errors.note?.type === 'maxLength' && <p role='alert'>Maximum note length is 40 characters</p>}

                <div className='form--buttons'>
                    <button className='button--green' type='submit'>Submit</button>
                    <button className='button--red' onClick={() => onClose({canceled: true, data: null})}>Cancel</button>
                </div>
                

            </form>
        </div>
    )
}