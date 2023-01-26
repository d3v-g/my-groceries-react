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

export const toastStyle = {
    style: {fontFamily: 'Inter', fontSize: '14px'}
}