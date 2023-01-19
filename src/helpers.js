export function selectCategory(data, selectedId) {
    return data.map(data => {
        if (data.id === selectedId) {
            return { ...data, selected: true }
        } else {
            if (data.selected != null) {
                return { ...data, selected: false }
            } else return data
        }
    })
}

export function selectItem(data, selectedId) {
    return data.map((category) => {
        return {...category, items: category.items.map((item) => {
            if (item.id === selectedId) {
                if (item.selected != null) {
                    return {...item, selected: !item.selected}
                } else {
                    return {...item, selected: true}
                }
            } else return item
        })}
    })
}

export function searchItem(data, name) {
    const currentCategory = data.find(category => category.selected)
    const itemId = currentCategory.items.find(item => item.name.toUpperCase() === name.toUpperCase())?.id
    if (itemId) {
        return data.map(category => {
            if (category.id === currentCategory.id) {
                return {
                    ...category, 
                    items: category.items.map(item =>{
                        if (item.highlighted) {
                            return {...item, highlighted: false}
                        } else {
                            return (item.id === itemId) ? {...item, highlighted: true} : item
                        }
                    })
                }
            } else return category
        }
        )
    }
}

export function cancelItemHighlight(data) {
    return data.map(category =>
        ({
            ...category,
            items: category.items.map(item => ({ ...item, highlighted: false }))
        })
    )
}

export function calculateTotal(data) {
    return data?.reduce((prevVal, currCat) => {
        return prevVal + currCat.items.reduce((prevVal, currItem) => {
            return prevVal + currItem.price * currItem.count
        }, 0)
    }, 0)
}

export function formatPrice(currency, num) {
    return (currency && num != null) ? `${currency} ${num?.toFixed(2)}` : ''
}