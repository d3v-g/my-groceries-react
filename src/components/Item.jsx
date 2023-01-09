import deleteImage from '../assets/delete.png'
import editImage from '../assets/edit.png'
import subtractImage from '../assets/subtract.png'
import addItemImage from '../assets/add-item.png'

import { useState } from 'react'

export default function Item({
    name, note, count, id, handleClick, addItemCount, subtractItemCount
}) {
    // todo: use the change detection mechanism in home component
    const [updatedCount, setUpdatedCount] = useState(count)

    return (
        <div className='item'>
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
                <button onClick={() => {
                    subtractItemCount(id, updatedCount)
                        .then(data => setUpdatedCount(data))
                }}>
                    <img src={subtractImage} />
                </button>
                <p className='item--count'>{updatedCount}</p>
                <button onClick={() => {
                    addItemCount(id, updatedCount)
                        .then(data => setUpdatedCount(data))
                }
                }>
                    <img src={addItemImage} />
                </button>
            </div>
        </div>
    )
}