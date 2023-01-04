import { supabase } from '../supabaseClient'

export default function DeleteForm({ initialData, onClose, target }) {
    async function handleDelete() {
        const { error } = await supabase
            .from(target === 'category' ? 'categories' : 'items')//select categories or items table
            .delete()
            .eq('id', initialData.id)
        if (error) {
            console.error(error)
        } else {
            onClose({canceled: false, data: initialData})
        }
    }    

    function handleKeyDown(event) {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            handleDelete()
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
        <div className='modal--form'>
            <p className='form--question'>{`Are you sure you want to delete this ${target}: ${initialData.name}?`}</p>
            {target === 'category' && <p className='form--warning' role='alert'>Please note, deleting a category will subsequently delete ALL ITEMS in that category</p>}
            <div className='form--buttons form--buttons--delete'>
                <button className='button--red' onClick={handleDelete}>Yes, delete</button>
                <button className='button--green'onClick={() => onClose({canceled: true, data: null})}>No, do not delete</button>
            </div>
        </div>
    )
}