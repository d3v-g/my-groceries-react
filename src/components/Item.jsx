import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'
import subtractImage from '../assets/subtract.png'
import addItemImage from '../assets/add-item.png'

export default function Item({
    name, note, count, id, highlighted, handleClick, updateItemCount
}) {
    return (
        <div className={`item ${highlighted ? 'item--active' : ''}`}>
            <div className='item--title'>
                <p>{name}</p>
                <button
                    className='edit--button'
                    id={id}
                    onClick={event => {handleClick(event, 'edit', 'item')}}>
                    <img src={editImage} />
                </button >
                <button
                    className='delete--button'
                    id={id}
                    onClick={event => handleClick(event, 'delete', 'item')} 
                >
                    <img src={deleteImage} />
                </button>
                
            </div>
            <p className='item--note'>note: {note ?? ''}</p>
            <div className='item--count'>
                <button onClick={() => {updateItemCount(id, count, 'subtract')}}>
                    <img src={subtractImage} />
                </button>
                <p className='item--count'>{count}</p>
                <button onClick={() => {updateItemCount(id, count, 'add')}}>
                    <img src={addItemImage} />
                </button>
            </div>
        </div>
    )
}