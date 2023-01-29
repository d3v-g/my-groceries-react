import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import ShoppingListContainer from '../components/ShoppingListContainer'
import CategoryForm from '../forms/CategoryForm'
import ItemForm from '../forms/ItemForm'
import DeleteForm from '../forms/DeleteForm'
import CurrencyForm from '../forms/CurrencyForm'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { addItemCount, subtractItemCount, generateList, updateUserCurrency } from '../api.js'
import { selectCategory, selectItem, notify } from '../helpers.js'

export default function Home({
    user, changeCurrency
}) {
    // todo:
    // move toast to app level
    const [groceryData, setGroceryData] = useState(null)
    // todo: refactor to change the groceryData state instead
    const [changeDetected, setChangeDetected] = useState(false)

    useEffect(() => {
        const currentCategoryId = groceryData?.find(data => data.selected)?.id
        generateList()
            ?.then(data =>
                currentCategoryId
                    ?
                    data.map(data => data.id === currentCategoryId ? { ...data, selected: true } : data)
                    :
                    data.map((data, index) => index === 0 ? { ...data, selected: true } : data))
            .then(data => setGroceryData(data))
    }, [changeDetected, user?.currency])

    async function updateItemCount(id, count, addOrSubtract) {
        const newCount = (addOrSubtract === 'add') ? await addItemCount(id, count) : await subtractItemCount(id, count)
        if (newCount != null) {
            setChangeDetected(prevState => !prevState)
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
                    currency={user?.currency}
                    handleClick={handleUserEvent}
                    updateItemCount={updateItemCount}
                />
        )
        
    const [userEvent, setUserEvent] = useState({ mode: '', target: '', id: '' })
    const [showModal, setShowModal] = useState(false)

    function handleUserEvent(event, mode, target) {
        if (!groceryData.filter(category => category.selected)[0] && mode + target === 'additem') {
            notify({ success: false, message: 'Please select a category' })
        } else {
            setShowModal(true)
            const id = event.currentTarget.id
            setUserEvent({ mode, target, id })
        }
    }
    
    const onModalClose = (res) => {
        setShowModal(false)
        if (res.canceled) {
            notify({ success: false, message: 'Change cancelled' })
        } else {
            const action = `${userEvent.mode}${userEvent.mode != 'delete' ? 'ed' : 'd'}`
            setChangeDetected(prevState => !prevState)
            notify({ success: true, message: `You have successfully ${action}: ${res.data.name}` })
        }
    }

    if (!user) {
        return <Navigate replace to='/login' />
    } else {
        return (
            <div className="container">
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
                            currency={user?.currency} 
                            submitResponse={res => updateUserCurrency(res)
                                ?.then(currency => changeCurrency(currency))}
                        />
                        <button
                            className='button--add'
                            onClick={event => handleUserEvent(event, 'add', 'item')}
                        >Add item</button>
                    </div>
                </div>
                <hr className="break"></hr>
                <ShoppingListContainer
                    groceryData={groceryData}
                    currency={user?.currency}
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