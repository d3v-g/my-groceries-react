import Modal from '../components/Modal'
import CategoriesContainer from '../components/CategoriesContainer'
import ItemsContainer from '../components/ItemsContainer'
import ShoppingListContainer from '../components/ShoppingListContainer'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { generateList } from '../api.js'
import { selectCategory, selectItem, notify, setUserEventInState, setGroceryDataInState } from '../helpers.js'

export default function Home({
    user, changeCurrency
}) {
    const [groceryData, setGroceryData] = useState(null)
    const [userEvent, setUserEvent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        generateList()
            ?.then(data =>
                    data.map((data, index) => index === 0 ? { ...data, selected: true } : data))
            .then(data => setGroceryData(data))
    }, [])

    function handleUserEvent(event, mode, target) {
        if (!groceryData.filter(category => category.selected)[0] && mode + target === 'additem') {
            notify({ success: false, message: 'Please select a category' })
        } else {
            setShowModal(true)
            const id = event.currentTarget.id
            setUserEvent(setUserEventInState(mode, target, id, groceryData))
        }
    }
    
    const onModalClose = (res) => {
        setShowModal(false)
        if (res.canceled) {
            notify({ success: false, message: 'Change cancelled' })
        } else {
            const action = `${userEvent.mode}${userEvent.mode != 'delete' ? 'ed' : 'd'}`
            setGroceryData(prevData => setGroceryDataInState(prevData, res.data, userEvent.mode))
            notify({ success: true, message: `You have successfully ${action}: ${res.data.name}` })
        }
    }

    if (!user) {
        return <Navigate replace to='/login' />
    } else {
        return (
            <div className="container">

                <Modal
                    showModal={showModal}
                    onClose={onModalClose}
                    userEvent={userEvent}
                    title={`${userEvent?.mode} a${userEvent?.target === 'item' ? 'n' : ''} ${userEvent?.target}`}
                />

                <CategoriesContainer 
                    groceryData={groceryData} 
                    handleUserEvent={handleUserEvent}
                    handleSelect={(id) => setGroceryData(prevData => selectCategory(prevData, id))}
                />

                <hr className="break"></hr>

                <ItemsContainer 
                    groceryData={groceryData}
                    currency={user.currency}
                    changeCurrency={changeCurrency}
                    updateItemCount={res => setGroceryData(prevData => setGroceryDataInState(prevData, res, 'edit'))}
                    handleUserEvent={handleUserEvent}
                />

                <hr className="break"></hr>

                <ShoppingListContainer
                    groceryData={groceryData}
                    currency={user.currency}
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