export default function ListComponent({ category, items, controlStrikeThrough }) {
    
    const itemElements = items.
        filter(item => item.count > 0)
        .map(item => {
        return (
            <div className={`list--items ${item?.selected ? 'strikethrough' : ''}`} key={item.id}>
                <p id={item.id} name='item' onClick={(e) => controlStrikeThrough(e)}>
                    {item.count > 0 && `${item.name}  x ${item.count}`}
                    {/* {item.name}  x {item.count} */}
                </p>
                <p>{item.note && `note: ${item.note}` }</p>
            </div>
        )
    })
    
    return (
        <div className='list--component'>
            <p
                className={`list--category ${category?.selected ? 'strikethrough' : ''}`}
                id={category.id}
                name={category.name}
            >{category.name}</p>
            {itemElements}
        </div>
    )
}