import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import List from '../components/List'
import CategoryForm from '../forms/CategoryForm'
import ItemForm from '../forms/ItemForm'
import DeleteForm from '../forms/DeleteForm'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { addItemCount, subtractItemCount, generateList } from '../helpers.js'
import searchImg from '../assets/searchImg.png'

export default function Home({
    userLoggedIn, userId
}) {
    // next todo: optimise data fetching in Home component

    const [alertText, setAlertText] = useState(null)
    function showAlert(text) {
        setAlertText(text)
        setTimeout(() => {
            setAlertText('')
        }, 5000)
    }
    const [groceryData, setGroceryData] = useState(null)
    const [changeDetected, setChangeDetected] = useState(false)

    useEffect(() => {
        let currentCategoryId = null
        if (groceryData?.find(data => data.selected)) {
            currentCategoryId = groceryData.id
        }

        generateList()
            .then(data =>
                currentCategoryId
                    ?
                    data.map(data => data.id === currentCategoryId ? { ...data, selected: true } : data)
                    :
                    data.map((data, index) => index === 0 ? { ...data, selected: true } : data))
            .then(data => setGroceryData(data))
    }, [changeDetected])

    function handleSelect(event) {
        const id = event.currentTarget.id
        setGroceryData(prevData => prevData.map(data => {
            if (data.id === id) {
                return { ...data, selected: true }
            } else {
                if (data.selected != null) {
                    return { ...data, selected: false }
                } else return data
            }
        }))
    }

    const categoryElements = groceryData?.map(category =>
        <Category
            name={category.name}
            key={category.id}
            id={category.id}
            selected={category.selected}
            handleSelect={handleSelect}
            handleClick={handleUserEvent}
        />
    )

    const itemElements = groceryData
        ?.filter(element => element.selected)[0]
        ?.items
        ?.map(item =>
            <Item
                name={item.name}
                note={item.note}
                count={item.count}
                key={item.id}
                id={item.id}
                handleClick={handleUserEvent}
                addItemCount={addItemCount}
                subtractItemCount={subtractItemCount}
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
            showAlert('Change cancelled')
        } else {
            showAlert(`You have successfully ${userEvent.mode}${userEvent.mode != 'delete' ? 'ed' : 'd'}: ${response.data[0]?.name || response.data?.name}`)
            setChangeDetected(prevState => !prevState)
        }
    }

    if (!userLoggedIn) {
        return <Navigate replace to='/login' />
    } else {
        return (
            <div className="container">
                <p>{alertText}</p>
                {showModal &&
                    <Modal onClose={onModalClose} title={`${userEvent.mode} a${userEvent.target === 'item' ? 'n' : ''} ${userEvent.target}`}>
                        {userEvent.mode === 'delete'
                            ?
                            <DeleteForm
                                initialData={userEvent.target === 'category' ? groceryData.find(c => c.id === userEvent.id) : groceryData.filter(c => c.selected)[0].items.find(i => i.id === userEvent.id)}
                                onClose={onModalClose} userId={userId} target={userEvent.target}
                            />
                            :
                            (userEvent.target === 'category'
                                ?
                                <CategoryForm
                                    initialData={groceryData.find(c => c.id === userEvent.id)}
                                    onClose={onModalClose}
                                    userId={userId}
                                    mode={userEvent.mode}
                                />
                                :
                                <ItemForm
                                    initialData={groceryData.filter(c => c.selected)[0].items.find(i => i.id === userEvent.id)}
                                    onClose={onModalClose}
                                    userId={userId}
                                    mode={userEvent.mode}
                                    parentCategoryId={groceryData.find(data => data.selected).id}
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
                        <div className='items--search'>
                            <input
                                className='items--search--input'
                                type='text'
                                placeholder='Search for an item'
                            >
                            </input>
                            <button className='items--search--button'>
                                <img src={searchImg} />
                            </button>
                        </div>
                        <button
                            className='button--add'
                            onClick={event => handleUserEvent(event, 'add', 'item')}
                        >Add item</button>
                    </div>
                </div>
                <hr className="break"></hr>
                <List />
            </div>
        )
    }

}