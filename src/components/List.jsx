import { generateList } from '../helpers.js'
import { useState, useEffect } from 'react'
import ListComponent from './ListComponent'

export default function List() {

    const [list, setList] = useState(null)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        generateList()
            .then(data => setList(data))
    }, [refresh])

    function controlStrikeThrough(event) {
        const id = event.target.id
            setList(prevList => prevList.map((data) => {
                return {...data, items: data.items.map((item) => {
                    if (item.id === id) {
                        if (item.selected != null) {
                            return {...item, selected: !item.selected}
                        } else {
                            return {...item, selected: true}
                        }
                    } else return item
                })}
            }))
    }

    // todo: make function to update category/item to be crossed out if clicked
    const listElements = list
        // .filter(data => )
        ?.map(data => 
            <ListComponent 
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
                        <button className='list--header--refresh' onClick={() => setRefresh(prevRefresh => !prevRefresh)}>
                            <p>Refresh</p>
                        </button>
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