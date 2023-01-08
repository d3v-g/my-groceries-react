import ShoppingListSection from './ShoppingListSection'

export default function ShoppingListContainer({ groceryData, controlStrikeThrough }) {

    //remove list and instead pass in groceryData as arg into ShoppingListContainer
    // const [list, setList] = useState(null)
    // //remove refresh made redundant by passing in groceryData as this will trigger re-render of this component same effect as clicking refresh
    // const [refresh, setRefresh] = useState(false)

    // // remove this not required once you pass into ShoppingListContainer component your grocery data from home, this will trigger a re-render of your component
    // useEffect(() => {
    //     generateList()
    //         .then(data => setList(data))
    // }, [refresh])

    // It would be more ideal to change the data structure so that each entry as key is the id of the thing
    // Either do this in the db or at the data retrieval point from supabase
    // e.g. you have: 
    // [
    //     0: {id: 123, items:[]},  
    //     1: {id: 124, items: [0:{id:8, name:"a"}, 1:{id:9, name:"b"}, 2:{id:10, name:"c"}]}
    //     1: {id: 125, category: "pills", items: [0:{id:11, name:"d"}]}
    // ]
    // we want instead IDs more accessible, don't worry about the slight duplication of having id as key and also inside the value object e.g.:
    // NOTE YOU MOST LIKELY WILL BE ABLE TO DO SOMETHING NICE AND CLEVER WITH DE-STRUCTURING SYNTAX
    // [
    //     123: {id: 123, items:[]},  
    //     124: {id: 124, items: [8:{id:8, name:"a"}, 9:{id:9, name:"b"}, 10:{id:10, name:"c"}]}
    //     125: {id: 125, category: "pills", items: [11:{id:11, name:"d"}]}
    // ]

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