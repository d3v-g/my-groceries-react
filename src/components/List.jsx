import { generateList } from '../helpers.js'
import { useState, useEffect } from 'react'
import ListComponent from './ListComponent'


export default function List() {

    const [list, setList] = useState(null)

    useEffect(() => {
        generateList()
            .then(data => setList(data))
    }, [])

    // todo: make function to update category/item to be crossed out if clicked
    const listElements = list?.map((data) => 
        <ListComponent 
            category={data.name}
            items={data.items}
            key={data.id}
        />
    )

    return (
        <div className='list'>
            {listElements}
        </div>
    )
}