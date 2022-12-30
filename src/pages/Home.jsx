import Category from '../components/Category'
import Modal from '../components/Modal'
import Item from '../components/Item'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import CategoryAddForm from '../components/CategoryAddForm'
import searchImg from '../assets/searchImg.png'
import { supabase } from '../supabaseClient'

export default function Home({ 
    userLoggedIn
}) {
    const [categories, setCategories] = useState(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [items, setItems] = useState(null)

    async function getCategories() {
        const {data} = await supabase.from('categories')
            .select('category_name, id')
        setCategories(data)
        setSelectedCategoryId(selectedCategoryId ?? data[0].id)
    }

    async function getItems() {
        const {data} = await supabase.from('items')
            .select('id, item_name, note, count')
            .eq('parent_category_id', selectedCategoryId)
        setItems(data)
    }

    
    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        if(selectedCategoryId) {
            getItems()
        }
    }, [selectedCategoryId])

    const categoryElements = categories?.map(data =>
        <Category
            category_name={data.category_name}
            key={data.id}
            id={data.id}
            currentCategoryId={selectedCategoryId}
            updateCurrentCategory={updateSelectedCategory}
            handleClick={handleClick}
        />
    )

    const itemElements = items?.map(data =>
        <Item
            item_name={data.item_name}
            item_note={data.note}
            item_count={data.count}
            key={data.id}
            id={data.id}
        />
    )
    
    function updateSelectedCategory(event) {
        setSelectedCategoryId(event.target.id);
      }
    
    // use state to keep track of whether the user is adding or editing, item or category
    const [mode, setMode] = useState('')
    const [target, setTarget] = useState('');
    const [showModal, setShowModal] = useState(false);
    // keep track of the id of the category/item that is being edited/deleted
    const [id, setId] = useState(null)

    function handleClick(event) {
        setMode(event.target.dataset.mode);
        setTarget(event.target.dataset.target);
        setShowModal(true);
        setId(event.target.dataset.id);
    }

    //Data returned from model, I think this should be leveraged higher up from App
    const [modalResponse, setModalResponse] = useState(null)

    const onModalClose = (response) => {
        setShowModal(false);
        setModalResponse(response); // We should "reduce" the data from app
    }
    
    // extract all the items out of the data prop
    // const currentItems = items[currentCategoryIndex];

    // if user is not logged in, navigate to log in page
    if (!userLoggedIn) {
        return <Navigate replace to='/login'/>
    } else {
        return (
            <div className="container">
                {showModal && 
                    <Modal onClose={onModalClose} initialData={null} title='Add a Category'>
                        <CategoryAddForm />
                    </Modal>
                }
                <div className='categories--container'>
                    <h2 className='title'>Categories</h2>
                    {categoryElements}
                    <button 
                        className='button--add'
                        data-target='category'
                        data-mode='add'
                        onClick={event => handleClick(event)}
                    >Add category</button>
                </div>
                <hr className="break"></hr>
                
                <div className='items--container'>
                <h2 className='title'>Items</h2>
                    <div className='items'>
                        {itemElements}
                    </div>
                    <div className='items--side--buttons'>
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
                            data-target='items'
                            data-mode='add'
                            onClick={event => handleClick(event)}
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