export default function ListComponent({ category, items, controlStrikeThrough }) {

    const itemElements = items
        .filter(item => item.count > 0)
        .map(item => {
        return (
            <div className={`list--items ${item?.selected ? 'strikethrough' : ''}`} key={item.id}>
                <p id={item.id} name='item' onClick={(e) => controlStrikeThrough(e)}>
                    {item.count > 0 && `${item.name}  x ${item.count}`}
                </p>
                <p>{item.note && `note: ${item.note}` }</p>
                <p>{item.price * item.count}</p>
            </div>
        )
    })

    return (
        <div className='list--component'>
            {itemElements.length > 0 && 
                <p
                    className={'list--category'}
                    id={category.id}
                    name={category.name}
                >{category.name}</p>
            }
            {itemElements}
        </div>
    )
}