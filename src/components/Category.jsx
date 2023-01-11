import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'

export default function Category({ 
    id, selected, handleSelect, name, handleClick
}) {

    return (
        <div
            className={`category ${selected && 'category--current'}`}
            id={id}
            onClick={handleSelect}
        >
            {name}
            <button className='edit--button' id={id} onClick={event => handleClick(event, 'edit', 'category')}>
                <img src={editImage} />
            </button>
            
            <button className="delete--button" id={id} onClick={event => handleClick(event, 'delete', 'category')}>
                <img src={deleteImage} />
            </button>
        </div>
    )
};