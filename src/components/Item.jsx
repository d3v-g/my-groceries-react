import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'
import subtractImage from '../assets/subtract.png'
import addItemImage from '../assets/add-item.png'


export default function Item({
    item_name, item_note, item_count, id, handleClick
}) {
    return (
        <div className='item'>
            <div className='item--title'>
                <p>{item_name}</p>
                <button
                    className='edit--button'
                    onClick={event => {handleClick(event, 'edit', 'item')}}>
                    <img src={editImage} />
                </button >
                <button
                    className='delete--button'
                    onClick={event => handleClick(event, 'delete', 'item')} 
                >
                    <img src={deleteImage} />
                </button>
                
            </div>
            <p className='item--note'>note: {item_note ?? ''}</p>
            <div className='item--count'>
                <button>
                    <img src={subtractImage} />
                </button>
                <p className='item--count'>{item_count}</p>
                <button>
                    <img src={addItemImage} />
                </button>
            </div>
        </div>
    )
}