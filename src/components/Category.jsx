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
            <button className='edit--button' onClick={event => handleClick(event)}>
                <img
                    src={editImage}
                    data-target='category'
                    data-mode='edit'
                    data-id={id}
                />
            </button>
            
            <button className="delete--button" onClick={event => handleClick(event)}>
                <img
                    src={deleteImage}
                    data-target='category'
                    data-mode='delete'
                    data-id={id}
                />
            </button>

            
        </div>
    )
};