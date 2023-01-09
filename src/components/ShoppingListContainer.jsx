import ShoppingListSection from './ShoppingListSection'
import { useState, useRef } from 'react'
import ReactToPrint from 'react-to-print'
import JsPDF from 'jspdf'

export default function ShoppingListContainer({ groceryData, controlStrikeThrough }) {
    const [isCopied, setIsCopied] = useState(false)
    let componentRef = useRef()

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
    
    function handleDownload() {
        console.log('download')
        const pdf = new JsPDF
        pdf.html(componentRef).then(() => pdf.save('shopping_list.pdf'))
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
                        <ReactToPrint 
                            trigger={() => 
                                <button className='list--header--print'>
                                    <p>Print</p>
                                </button>
                            }
                            content={() => componentRef}
                         />
                        
                        <button className='list--header--download' onClick={() => handleDownload()}>
                            <p>Download as pdf</p>
                        </button>
                    </div>
                </div>
                <div className='list--content' ref={(el) => (componentRef = el)}>
                    {listElements}
                </div>
        </div>
    )
}