import ShoppingListSection from './ShoppingListSection'
import { useState } from 'react'

export default function ShoppingListContainer({ groceryData, controlStrikeThrough }) {
    const [isCopied, setIsCopied] = useState(false)

    const listElements = groceryData
        ?.map(data => 
            <ShoppingListSection 
                category={data}
                items={data.items}
                key={data.id}
                controlStrikeThrough={controlStrikeThrough}
            />
        )

    function handleCopy() {
        const text = groceryData.reduce((a, x) => {
            const items = x.items.reduce((b, y) => `${b}-${y.name}\n`, '')
            return `${a}${x.name.toUpperCase()}\n${items}`
        }, 'My shopping list: \n')
        navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 5000)
    }

    return (
        <div>
            <div className='list--header'>
                    <h2 className='title'>Shopping List</h2>
                    <div className='list--header--utils'>
                        {isCopied && <p className='list--header--alert'>Successfully copied to your clipboard</p>}
                        <button className='list--header--copy' onClick={() => handleCopy()}>
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