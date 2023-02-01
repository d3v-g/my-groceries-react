import Category from "./Category"

export default function CategoriesContainer({ groceryData, handleUserEvent, handleSelect }) {
    const  categoryElements = groceryData?.map(category =>
        <Category
            category={category}
            key={category.id}
            handleEventClick={handleUserEvent}
            handleSelect={handleSelect}
        />
    )
    return (
        <div className='categories--container'>
            <h2 className='title'>Categories</h2>
            <div className='categories'>{categoryElements}</div>
            <button
                className='button--add'
                onClick={event => handleUserEvent(event, 'add', 'category')}
            >Add category</button>
        </div>
    )
}