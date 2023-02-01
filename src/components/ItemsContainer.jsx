import Item from "./Item"
import CurrencyForm from "../forms/CurrencyForm"
import { updateUserCurrency } from "../api"

export default function ItemsContainer({ groceryData, currency, changeCurrency, updateItemCount, handleUserEvent }) {
    const itemElements = groceryData
    ?.filter(category => category.selected)[0]
    ?.items
    ?.map(item =>
            <Item
                item={item}
                key={item.id}
                currency={currency}
                handleEventClick={handleUserEvent}
                updateItemCount={updateItemCount}
            />
    )

    return (
        <div className='items--container'>
            <h2 className='title'>Items</h2>
            <div className='items'>
                {itemElements}
            </div>
            <div className='items--side'>
                <CurrencyForm 
                    currency={currency} 
                    submitResponse={res => updateUserCurrency(res)
                        ?.then(currency => changeCurrency(currency))}
                />
                <button
                    className='button--add'
                    onClick={event => handleUserEvent(event, 'add', 'item')}
                >Add item</button>
            </div>
        </div>
    )
}