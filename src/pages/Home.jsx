import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import List from '../components/List'
import CategoryForm from '../forms/CategoryForm'
import ItemForm from '../forms/ItemForm'
import DeleteForm from '../forms/DeleteForm'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getCategories, getItems, addItemCount, subtractItemCount, generateList } from '../helpers.js'
import searchImg from '../assets/searchImg.png'

export default function Home({
    userLoggedIn, userId
}) {
    const [alertText, setAlertText] = useState(null)
    function showAlert(text) {
        setAlertText(text)
        setTimeout(() => {
            setAlertText('')
        }, 5000)
    }

    const [categories, setCategories] = useState(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [items, setItems] = useState(null)

    useEffect(() => {
        getCategories()
            .then(
                data => {
                    setCategories(data);
                    setSelectedCategoryId(selectedCategoryId ?? data[0]?.id)
                })
    }, [])

    useEffect(() => {
        if (selectedCategoryId) {
            getItems(selectedCategoryId)
                .then(data => setItems(data))
        }
    }, [selectedCategoryId])

    const categoryElements = categories?.map(data =>
        <Category
            name={data.name}
            key={data.id}
            id={data.id}
            currentCategoryId={selectedCategoryId}
            updateCurrentCategory={setSelectedCategoryId}
            handleClick={handleUserEvent}
        />
    )

    const itemElements = items?.map(data =>
        <Item
            name={data.name}
            note={data.note}
            count={data.count}
            key={data.id}
            id={data.id}
            handleClick={handleUserEvent}
            addItemCount={addItemCount}
            subtractItemCount={subtractItemCount}
        />
    )

    const [userEvent, setUserEvent] = useState({ mode: '', target: '', id: '' })
    const [showModal, setShowModal] = useState(false)

    function handleUserEvent(event, mode, target) {
        if (mode != 'add') {
            setSelectedCategoryId(target === 'category' ? event.currentTarget.id : selectedCategoryId)
        }
        setUserEvent({ mode, target, id: event.currentTarget.id })
        setShowModal(true)
    }


    const onModalClose = (response) => {
        setShowModal(false)
        if (response.canceled) {
            showAlert('Change cancelled')
        } else {
            showAlert(`You have successfully ${userEvent.mode}${userEvent.mode != 'delete' ? 'ed' : 'd'}: ${response.data[0]?.name || response.data?.name}`)
            getCategories()
                .then(data => setCategories(data))
            getItems(selectedCategoryId)
                .then(data => setItems(data))
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
                                initialData={userEvent.target === 'category' ? categories.find(c => c.id === userEvent.id) : items.find(i => i.id === userEvent.id)}
                                onClose={onModalClose} userId={userId} target={userEvent.target}
                            />
                            :
                            (userEvent.target === 'category'
                                ?
                                <CategoryForm initialData={categories.find(c => c.id === userEvent.id)} onClose={onModalClose} userId={userId} mode={userEvent.mode} />
                                :
                                <ItemForm initialData={items.find(i => i.id === userEvent.id)} onClose={onModalClose} userId={userId} mode={userEvent.mode} parentCategoryId={selectedCategoryId} />
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