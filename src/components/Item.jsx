import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'
import subtractImage from '../assets/subtract.png'
import addItemImage from '../assets/add-item.png'
import { formatPrice } from '../helpers'

export default function Item({
    item, currency, handleClick, updateItemCount
}) {
    return (
        <div className={`item ${item.highlighted ? 'item--active' : ''}`}>
            <div className='item--title'>
                <p>{item.name}</p>
                <div className='item--buttons'>
                    <button
                        className='edit--button'
                        id={item.id}
                        onClick={event => {handleClick(event, 'edit', 'item')}}>
                        <img src={editImage} />
                    </button >
                    <button
                        className='delete--button'
                        id={item.id}
                        onClick={event => handleClick(event, 'delete', 'item')} 
                    >
                        <img src={deleteImage} />
                    </button> 
                </div>
            </div>
            <p className='item--price'>{formatPrice(currency, item.price)}</p>
            <p className='item--note'>note: {item.note ?? ''}</p>
            <div className='item--count'>
                <button onClick={() => {updateItemCount(item.id, item.count, 'subtract')}}>
                    <img src={subtractImage} />
                </button>
                <p className='item--count'>{item.count}</p>
                <button onClick={() => {updateItemCount(item.id, item.count, 'add')}}>
                    <img src={addItemImage} />
                </button>
            </div>
        </div>
    )
}