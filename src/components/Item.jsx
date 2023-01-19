import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'
import subtractImage from '../assets/subtract.png'
import addItemImage from '../assets/add-item.png'
import { formatPrice } from '../helpers'
import Draggable from 'react-draggable'
import { useRef } from  'react'

export default function Item({
    item, currency, handleClick, updateItemCount
    // handleDrag({cancalled: boolean, data:{item_id, new_parent_category_id}})
}) {
    // const nodeRef = useRef(null)

    function handleStart(e, data) {
        console.log('data: ', data)
        // console.log('event: ', e)
    }
    function handleStop(e, data) {
        // if mouse is touching any category
            // assgin item to that category
        // if mouse is not touching any category
            // assign item back to its original position
        console.log(e)
        console.log(e.path[0].id)
        // console.log('data: ', data)
    }

    return (
        // <Draggable 
        //     nodeRef={nodeRef}
        //     onStart={(e, data) => handleStart(e, data)}
        //     onStop={(e, data) => handleStop(e, data)}
        //     bounds={{bottom: 0}}
        // >
            <div className={`item ${item.highlighted ? 'item--active' : ''}`} >{/* ref={nodeRef}> */}
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
        // </Draggable>
    )
}