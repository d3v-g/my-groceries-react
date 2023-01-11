import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'

export default function Category({ 
    category, handleSelect, handleClick
}) {

    return (
        <div
            className={`category ${category.selected && 'category--current'}`}
            id={category.id}
            onClick={handleSelect}
        >
            {category.name}
            <button className='edit--button' id={category.id} onClick={event => handleClick(event, 'edit', 'category')}>
                <img src={editImage} />
            </button>
            
            <button className="delete--button" id={category.id} onClick={event => handleClick(event, 'delete', 'category')}>
                <img src={deleteImage} />
            </button>
        </div>
    )
};