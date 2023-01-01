import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'

export default function Category({ 
    id, currentCategoryId, updateCurrentCategory,
    category_name, handleClick
}) {

    return (
        <div
            className={`category ${currentCategoryId == id && 'category--current'}`}
            id={id}
            onClick={(event) => updateCurrentCategory(event)}
        >
            {category_name}
            <button className='edit--button' id={id} onClick={event => handleClick(event, 'edit', 'category')}>
                <img
                    src={editImage}
                />
            </button>
            
            <button className="delete--button" id={id} onClick={event => handleClick(event, 'delete', 'category')}>
                <img
                    src={deleteImage}
                    id={id}
                />
            </button>

            
        </div>
    )
};