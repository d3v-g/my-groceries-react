export default function ListComponent({ category, items }) {
    
    const itemElements = items?.map(item => {
        return (
            <div className='list--items' key={item.id}>
                <p className='list--item--name'>{item.name}  x {item.count}</p>
                {/* <p className='list--item--count'>x {item.count}</p> */}
                <p className='list--item--note'>{item.note && `note: ${item.note}` }</p>
            </div>
        )
    })
    
    return (
        <div className='list--component'>
            <p className='list--category'>{category}</p>
            {itemElements}
        </div>
    )
}