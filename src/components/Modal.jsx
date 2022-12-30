import exitImage from '../assets/exit.png'
import { useEffect } from 'react'

// initialData e.g. pre-populate form with data this could be useful in edit mode whereas creational will be empty 
// onClose e.g. controlled by parent and has the state of information for user response data and if the form was cancelled or not
// id, mode, target, handleChange, handleSubmit, cancelChange 
export default function Modal({
    initialData, onClose, title, children
}) {
    // listen to the 'enter' and 'escape' key
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                handleSubmit(event);
            }
            else if (event.code === 'Escape') {
                cancelChange(event);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    return (
        <div 
            className="modal"
            onClick={(event) => cancelChange(event)}
        >
            <div className="modal--content" onClick={(event) => event.stopPropagation()}>
                <div className="modal--header">
                    <h4 className="modal--title">{title}</h4>
                    <button 
                        className='modal--exit'
                        onClick={(event) => cancelChange(event)}
                    >
                        <img
                            src={exitImage}
                        />
                    </button>
                </div>
                {children}

                {/* <form className='modal--form' onSubmit={(event) => handleSubmit(event)}>
                    {mode === 'delete' ?
                        <p>Are you sure you want to delete this item: </p> :
                        <label className='modal--question'>
                            {`Enter a${target === 'items' ? 'n' : ''} `}{target}:
                            <input
                                type="text" 
                                data-target={target}
                                data-mode={mode}
                                data-id={id}
                                onChange={(event) => handleChange(event)}
                                placeholder='max 20 characters'
                                autoFocus='on'
                            />
                        </label>
                    }
                    
                    <div className='modal--buttons'>
                        <button 
                            className='modal--cancel'
                            onClick={(event) => cancelChange(event)}
                        >Cancel</button>
                        <button 
                            className='modal--save'
                            type="submit"
                        >Save</button>
                    </div>
                </form> */}
            </div>
        </div>
    )
}