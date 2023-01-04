import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import CategoryForm from '../forms/CategoryForm'
import ItemForm from '../forms/ItemForm'
import DeleteForm from '../forms/DeleteForm'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import searchImg from '../assets/searchImg.png'

async function getCategories() {
    const { data } = await supabase.from('categories')
        .select('name, id')
        .order('created_at')
    return data
}

async function getItems(parentCategoryId) {
    const { data } = await supabase.from('items')
        .select('id, name, note, count')
        .eq('parent_category_id', parentCategoryId)
        .order('created_at')
    return data
}

async function addItemCount(id, initialCount) {
    const { data, error } = await supabase
        .from('items')
        .update({ count: initialCount + 1 })
        .eq('id', id)
        .select()
    if (error) {
        console.error(error)
    } else return data.count
}

async function subtractItemCount(id, initialCount) {
    const { data, error } = await supabase
        .from('items')
        .update({ count: initialCount - 1 })
        .eq('id', id)
        .select()
    if (error) {
        console.error(error)
    } else return data.count
}


export default function Home({
    userLoggedIn, userId
}) {
    const [categories, setCategories] = useState(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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
            updateCurrentCategory={updateSelectedCategory}
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

    function updateSelectedCategory(event) {
        setSelectedCategoryId(event.target.id);
    }

    const [userEvent, setUserEvent] = useState({ mode: '', target: '', id: '' })
    const [showModal, setShowModal] = useState(false)

    function handleUserEvent(event, mode, target) {
        setUserEvent({ mode, target, id: event.currentTarget.id })
        setShowModal(true)
    }

    const [modalResponse, setModalResponse] = useState(null)
    // todo: make alert text to show up for 5 sec + after modal is closed

    const onModalClose = (response) => {
        setShowModal(false);
        setModalResponse(response); // We should "reduce" the data from app
        getCategories()
        getItems()
    }

    if (!userLoggedIn) {
        return <Navigate replace to='/login' />
    } else {
        return (
            <div className="container">
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
            </div>
        )
    }

}