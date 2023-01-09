import ShoppingListSection from './ShoppingListSection'

export default function ShoppingListContainer({ groceryData, controlStrikeThrough }) {

    const listElements = groceryData
        ?.map(data => 
            <ShoppingListSection 
                category={data}
                items={data.items}
                key={data.id}
                controlStrikeThrough={controlStrikeThrough}
            />
        )

    return (
        <div>
            <div className='list--header'>
                    <h2 className='title'>Shopping List</h2>
                    <div className='list--header--utils'>
                        <button className='list--header--copy'>
                            <p>Copy to Clipboard</p>
                        </button>
                        <button className='list--header--print'>
                            <p>Print</p>
                        </button>
                        <button className='list--header--download'>
                            <p>Download as pdf</p>
                        </button>
                    </div>
                </div>
                <div className='list--content'>
                    {listElements}
                </div>
        </div>
    )
}