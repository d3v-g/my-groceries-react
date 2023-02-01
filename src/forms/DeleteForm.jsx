import { useEffect } from 'react'
import { handleDelete } from '../api'

export default function DeleteForm({ initialData, onSubmit, target }) {

    function handleKeyDown(event) {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            handleDelete(target, initialData.id)
                .then(() => onSubmit({canceled: false, data: initialData}))
        }
        else if (event.code === 'Escape') {
            onSubmit({canceled: true, data: null})
        }
    }

    useEffect(() => {        
        document.addEventListener('keydown', handleKeyDown)
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div className='modal--form'>
            <p className='form--question'>{`Are you sure you want to delete this ${target}: ${initialData.name}?`}</p>
            {target === 'category' && <p className='form--warning' role='alert'>Please note, deleting a category will subsequently delete ALL ITEMS in that category</p>}
            <div className='form--buttons form--buttons--delete'>
                <button className='button--red' 
                    onClick={() =>
                        handleDelete(target, initialData.id)
                            .then(() => onSubmit({canceled: false, data: initialData}))
                    }
                >Yes, delete</button>
                <button className='button--green'onClick={() => onSubmit({canceled: true, data: null})}>No, do not delete</button>
            </div>
        </div>
    )
}