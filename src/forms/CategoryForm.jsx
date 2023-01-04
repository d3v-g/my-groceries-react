import { useForm } from "react-hook-form"
import { supabase } from '../supabaseClient'

// function handleKeyDown(event) {
//     if (event.code === 'Enter' || event.code === 'NumpadEnter') {
//         handleSubmit(event)
//     }
//     else if (event.code === 'Escape') {
//         cancelChange(event)
//     }
// };
export default function CategoryForm({ initialData, onClose, userId, mode }) { 

    const { register, handleSubmit, formState: { errors } } = useForm()
    // todo refactor into modal component????
    // useEffect(() => {        
    //     document.addEventListener('keydown', handleKeyDown)
        
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyDown)
    //     }
    // }, [])

    const onSubmit = async (formData) => {
        let data = null, error = null
        if(mode === 'add') {
             ({ data, error } = await supabase
               .from('categories')
               .insert({ name: formData.name, user_id: userId })
               .select())
        } else {
             ({ data, error } = await supabase
                .from('categories')
                .update({ name: formData.name })
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

        // <div 
        //     className="modal"
        //     onClick={(event) => cancelChange(event)}
        // >
        //     <div className="modal--content" onClick={(event) => event.stopPropagation()}>
        //         <div className="modal--header">
        //             <h4 className="modal--title">{mode} {target}</h4>
        //             <button 
        //                 className='modal--exit'
        //                 onClick={(event) => cancelChange(event)}
        //             >
        //                 <img
        //                     src={exitImage}
        //                 />
        //             </button>
        //         </div>

        //         <form className='modal--form' onSubmit={(event) => handleSubmit(event)}>
        //             <label className='modal--question'>
        //                 {`Enter a${target === 'items' ? 'n' : ''} `}{target}:
        //                 <input
        //                     type="text" 
        //                     data-target={target}
        //                     data-mode={mode}
        //                     data-id={id}
        //                     onChange={(event) => handleChange(event)}
        //                     placeholder='max 20 characters'
        //                     autoFocus='on'
        //                 />
        //             </label>
                    
        //             <div className='modal--buttons'>
        //                 <button 
        //                     className='modal--cancel'
        //                     onClick={(event) => cancelChange(event)}
        //                 >Cancel</button>
        //                 <button 
        //                     className='modal--save'
        //                     type="submit"
        //                 >Save</button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
    )
}