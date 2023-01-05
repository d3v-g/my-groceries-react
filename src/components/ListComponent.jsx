export default function ListComponent({ category, items }) {
    
    const itemElements = items?.map(item => {
        return (
            <div className='list--items' key={item.id}>
                <p className='list--item--name'>{item.name}</p>
                <p className='list--item--note'>{item.note}</p>
                <p className='list--item--count'>{item.count}</p>
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