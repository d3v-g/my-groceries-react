import { useEffect } from 'react'
import { useForm } from "react-hook-form"

// function handleKeyDown(event) {
//     if (event.code === 'Enter' || event.code === 'NumpadEnter') {
//         handleSubmit(event)
//     }
//     else if (event.code === 'Escape') {
//         cancelChange(event)
//     }
// };

// id, mode, target, handleChange, handleSubmit, cancelChange
export default function CategoryAddForm({ onSubmission }) { 
    const { register, handleSubmit, formState: { errors } } = useForm()

    // todo refactor into modal component????
    // useEffect(() => {        
    //     document.addEventListener('keydown', handleKeyDown)
        
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyDown)
    //     }
    // }, [])

    const onSubmit = (data) => {
        let returnData = data;
        console.log("submitted form", returnData);
    };

    return (
        <div className='modal--form'>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                <label htmlFor='categoryName' className='form--question'>Enter a category:</label>
                <input
                    className='form--input'
                    type='text'
                    placeholder='e.g. food'
                    {...register("categoryName", { required: true, maxLength: 20 })} 
                />
                <div className='modal--buttons'>
                    <button className='form--submit' type='submit'>Submit</button>
                    <button className='form--cancel'>Cancel</button>
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