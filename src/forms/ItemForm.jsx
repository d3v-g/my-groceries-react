import { useForm } from 'react-hook-form'
import { supabase } from '../supabaseClient'

export default function ItemForm({initialData, onClose, userId, mode, parentCategoryId}) {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async (formData) => {
        let data = null, error = null
        if(mode === 'add') {
             ({ data, error } = await supabase
               .from('items')
               .insert({ name: formData.name,note: formData.itemNote, user_id: userId, parent_category_id: parentCategoryId })
               .select())
        } else {
             ({ data, error } = await supabase
                .from('items')
                .update({ name: formData.name, note: formData.itemNote })
                .eq('id', initialData.id)
                .select())
        }
        if (data) {
            onClose({canceled: false, data})
        } else console.error(error)
    }

    return (
        <div>
            <form className='modal--form' onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
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

                <label htmlFor='itemNote' className='form--question'>
                    Add an optional note:
                </label>
                <input
                    className='form--input'
                    type='text'
                    placeholder='e.g. royal gala'
                    defaultValue={initialData?.note}
                    {...register('itemNote', { maxLength: 40 })}
                />
                {errors.itemNote?.type === 'maxLength' && <p role='alert'>Maximum note length is 40 characters</p>}
                
                <div className='form--buttons'>
                    <button className='button--green' type='submit'>Submit</button>
                    <button className='button--red' onClick={() => onClose({canceled: true, data: null})}>Cancel</button>
                </div>
                

            </form>
        </div>
    )
}