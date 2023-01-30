import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'
import subtractImage from '../assets/subtract.png'
import addItemImage from '../assets/add-item.png'
import { addItemCount, subtractItemCount } from '../api.js'
import { formatPrice } from '../helpers'

export default function Item({
    item, currency, handleEventClick, updateItemCount
}) {

    function handleCountClick(addOrSubtract) {
        addOrSubtract === 'add'
            ?
            addItemCount(item.id, item.count)
                .then(newCount => updateItemCount(newCount))
            :
            subtractItemCount(item.id, item.count)
                .then(newCount => updateItemCount(newCount))
    }

    return (
        <div className={`item ${item.highlighted ? 'item--active' : ''}`}>
            <div className='item--title'>
                <p>{item.name}</p>
                <div className='item--buttons'>
                    <button
                        className='edit--button'
                        id={item.id}
                        onClick={event => handleEventClick(event, 'edit', 'item')}>
                        <img src={editImage} />
                    </button >
                    <button
                        className='delete--button'
                        id={item.id}
                        onClick={event => handleEventClick(event, 'delete', 'item')} 
                    >
                        <img src={deleteImage} />
                    </button> 
                </div>
            </div>
            <p className='item--price'>{formatPrice(currency, item.price)}</p>
            <p className='item--note'>note: {item.note ?? ''}</p>
            <div className='item--count'>
                <button onClick={() => handleCountClick('subtract')}>
                    <img src={subtractImage} />
                </button>
                <p className='item--count'>{item.count}</p>
                <button onClick={() => handleCountClick('add')}>
                    <img src={addItemImage} />
                </button>
            </div>
        </div>
    )
}