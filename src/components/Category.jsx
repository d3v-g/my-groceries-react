import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'

export default function Category({ 
    category, handleSelect, handleEventClick
}) {

    return (
        <div
            className={`category ${category.selected && 'category--current'}`}
            id={category.id}
            onClick={() => handleSelect(category.id)}
        >
            {category.name}
            <button className='edit--button' id={category.id} onClick={event => handleEventClick(event, 'edit', 'category')}>
                <img src={editImage} />
            </button>
            
            <button className="delete--button" id={category.id} onClick={event => handleEventClick(event, 'delete', 'category')}>
                <img src={deleteImage} />
            </button>
        </div>
    )
};