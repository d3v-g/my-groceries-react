import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import SearchItemForm from '../forms/SearchItemForm'
import ShoppingListContainer from '../components/ShoppingListContainer'
import CategoryForm from '../forms/CategoryForm'
import ItemForm from '../forms/ItemForm'
import DeleteForm from '../forms/DeleteForm'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { addItemCount, subtractItemCount, generateList } from '../api.js'
import { selectCategory, selectItem, searchItem, cancelItemHighlight } from '../helpers.js'

export default function Home({
    userLoggedIn
}) {
    // next todo: debug print pdf and download pdf difference
    // next todo: enable scroll to searched item
    // next todo: enable item dragging
    // next todo: enable currency choosing
    
    const [groceryData, setGroceryData] = useState(null)
    
    const [changeDetected, setChangeDetected] = useState({alertText: '', internalText: ''})

    // console.log('grocery data', groceryData)

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

    useEffect(() => {
        const currentCategoryId = groceryData?.find(data => data.selected)?.id
        generateList()
            // .then(data => data.reduce((a, currentC) => {
            //         a[currentC.id] = {...currentC, items: currentC.items.reduce((b, currentI) => {
            //             b[currentI.id] = currentI
            //             return b
            //         }, {})
            // }
            //     return a
            //     }, {})
            // )
            // .then(data => {
            //     console.log('yo mo fo', data['d0bab6df-dbb5-46c3-9ec4-9d0c2e4877af']);
            // })
            // .then(data => {
            //     const id = 'd0bab6df-dbb5-46c3-9ec4-9d0c2e4877af'
            //     const { [id]: object } = data
            //     console.log(object)
            // })

            .then(data =>
                currentCategoryId
                ?
                    data.map(data => data.id === currentCategoryId ? { ...data, selected: true } : data)
                    :
                    data.map((data, index) => index === 0 ? { ...data, selected: true } : data))
            .then(data => setGroceryData(data))
            
    }, [changeDetected.internalText])

    // useEffect(() => {
    //     console.log('use effect fired')
    //     function handleScroll(e) {
    //         console.log('event listener fired', e)
    //         this.scrollTop
    //     }
    //     const itemsEl = document.querySelectorAll('.item')
    //     itemsEl.forEach(itemEl => itemEl.addEventListener('transitionrun', handleScroll))
    //     return itemsEl.forEach(itemEl => itemEl.removeEventListener('transitionrun', handleScroll))
    // }
    // , [groceryData?.find(category => category.selected)?.items])

    async function updateItemCount(id, count, addOrSubtract) {
        const newCount = (addOrSubtract === 'add') ? await addItemCount(id, count) : await subtractItemCount(id, count)
        if (newCount != null) {
            setChangeDetected(prevState => ({...prevState, internalText: `user updated count of ${id} to ${newCount}`}))
        }
    }
        
    const categoryElements = groceryData?.map(category =>
        <Category
            category={category}
            key={category.id}
            handleSelect={() => setGroceryData(prevData => selectCategory(prevData, category.id))}
            handleClick={handleUserEvent}
        />
    )

    const itemElements = groceryData
        ?.filter(element => element.selected)[0]
        ?.items
        ?.map(item =>
            <Item
                item={item}
                key={item.id}
                handleClick={handleUserEvent}
                updateItemCount={updateItemCount}
            />
        )
        
    const [userEvent, setUserEvent] = useState({ mode: '', target: '', id: '' })
    const [showModal, setShowModal] = useState(false)

    function handleUserEvent(event, mode, target) {
        setShowModal(true)
        const id = event.currentTarget.id
        setUserEvent({ mode, target, id })
    }
    
    const onModalClose = (response) => {
        setShowModal(false)
        if (response.canceled) {
            setChangeDetected(prevState => ({...prevState, alertText: 'Change cancelled'}))
        } else {
            const action = `${userEvent.mode}${userEvent.mode != 'delete' ? 'ed' : 'd'}`
            setChangeDetected({
                alertText: `You have successfully ${action}: ${response.data.name}`,
                internalText: `User ${action} grocery data to: ${response.data.id}, ${response.data.name}, ${response.data.price}, ${response.data.note}`
            })
            setTimeout(() => {
                setChangeDetected(prevState =>  ({...prevState, alertText: ''}))
            }, 5000)
        }
    }

    if (!userLoggedIn) {
        return <Navigate replace to='/login' />
    } else {
        return (
            <div className="container">
                <p>{changeDetected.alertText}</p>
                {showModal &&
                    <Modal onClose={onModalClose} title={`${userEvent.mode} a${userEvent.target === 'item' ? 'n' : ''} ${userEvent.target}`}>
                        {userEvent.mode === 'delete'
                            ?
                            <DeleteForm
                                initialData={
                                    userEvent.target === 'category' 
                                        ? groceryData.find(c => c.id === userEvent.id) 
                                        : groceryData.filter(c => c.selected)[0].items.find(i => i.id === userEvent.id)
                                }
                                onClose={onModalClose} target={userEvent.target}
                            />
                            :
                            (userEvent.target === 'category'
                                ?
                                <CategoryForm
                                    initialData={groceryData.find(c => c.id === userEvent.id)}
                                    onClose={onModalClose}
                                    mode={userEvent.mode}
                                />
                                :
                                <ItemForm
                                    initialData={groceryData.filter(c => c.selected)[0].items.find(i => i.id === userEvent.id)}
                                    onClose={onModalClose}
                                    mode={userEvent.mode}
                                    parent_category_id={groceryData.find(data => data.selected).id}
                                />
                            )
                        }
                    </Modal>
                }
                <div className='categories--container'>
                    <h2 className='title'>Categories</h2>
                    <div className='categories'>{categoryElements}</div>
                    <button
                        className='button--add'
                        onClick={event => handleUserEvent(event, 'add', 'category')}
                    >Add category</button>
                </div>
                <hr className="break"></hr>

                <div className='items--container'>
                    <h2 className='title'>Items</h2>
                    <div className='items'>
                        {itemElements}
                    </div>
                    <div className='side--buttons'>
                        <SearchItemForm submitResponse={name =>{
                            setGroceryData(prevData => searchItem(prevData, name));
                            setTimeout(() => {
                                setGroceryData(prevData => cancelItemHighlight(prevData))
                            }, 5000)
                        }} />
                        <button
                            className='button--add'
                            onClick={event => handleUserEvent(event, 'add', 'item')}
                        >Add item</button>
                    </div>
                </div>
                <hr className="break"></hr>
                <ShoppingListContainer groceryData={groceryData} controlStrikeThrough={event => setGroceryData(prevData => selectItem(prevData, event.target.id))} />
            </div>
        )
    }

}