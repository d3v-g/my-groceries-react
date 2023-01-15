import { formatPrice } from "../helpers"

export default function ListComponent(
    { category, items, currency, controlStrikeThrough }
) {
    const itemElements = items
        .filter(item => item.count > 0)
        .map(item => {
        return (
            <div className={`list--items ${item?.selected ? 'strikethrough' : ''}`} key={item.id}>
                <p id={item.id} name='item' onClick={(e) => controlStrikeThrough(e)}>
                    {item.count > 0 && `${item.name}  x ${item.count}`}
                </p>
                <p>{item.note && `note: ${item.note}` }</p>
                <p>{formatPrice(currency, item.price * item.count)}</p>
            </div>
        )
    })
    
    if (itemElements.length > 0) {
        return (
            <div className='list--component'>
                    <p
                        className={'list--category'}
                        id={category.id}
                        name={category.name}
                    >{category.name}</p>
                {itemElements}
            </div>
        )
    }
}