import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import SearchItemForm from '../forms/SearchItemForm'
import ShoppingListContainer from '../components/ShoppingListContainer'
import CategoryForm from '../forms/CategoryForm'
import ItemForm from '../forms/ItemForm'
import DeleteForm from '../forms/DeleteForm'
import CurrencyForm from '../forms/CurrencyForm'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { addItemCount, subtractItemCount, generateList, getUserCurrency, updateUserCurrency } from '../api.js'
import { selectCategory, selectItem, searchItem, cancelItemHighlight } from '../helpers.js'

export default function Home({
    userLoggedIn
}) {
    // next todo: enable scroll to searched item
    // next todo: enable item dragging
    
    const [groceryData, setGroceryData] = useState(null)
    const [currency, setCurrency] = useState(null)
    const [changeDetected, setChangeDetected] = useState({alertText: '', internalText: ''})

    useEffect(() => {
        getUserCurrency()
            .then(data => setCurrency(data))
    }, [])

    useEffect(() => {
        const currentCategoryId = groceryData?.find(data => data.selected)?.id
        generateList()
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
                    currency={currency}
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
        }
        setTimeout(() => {
            setChangeDetected(prevState =>  ({...prevState, alertText: ''}))
        }, 5000)
    }

    if (!userLoggedIn) {
        return <Navigate replace to='/login' />
    } else {
        return (
            <div className="container">
                {changeDetected.alertText && <p className='alertText' role='alert'>{changeDetected.alertText}</p>}
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
                    <div className='items--side'>
                        <CurrencyForm 
                            currency={currency} 
                            submitResponse={res => 
                                updateUserCurrency(res)
                                    .then(currency => setCurrency(currency))}
                        />
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
                <ShoppingListContainer
                    groceryData={groceryData}
                    currency={currency}
                    controlStrikeThrough={event =>
                        setGroceryData(prevData =>
                            selectItem(prevData, event.target.id)
                        )
                    }
                />
            </div>
        )
    }
}