import toast from 'react-hot-toast'

function orderGroceryData(data) {
    function compare(a, b) {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    }
    return data.map(category => ({...category, items: category.items.sort(compare)})).sort(compare)
}

export function findCurrentCategoryId(data) {
    return data.find(category => category.selected).id
}

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

export function setItemCountInState(data, id, newCount) {
    if (newCount != null) {
        return data.map(category => {
            if (category.selected) {
                return {...category, items: category.items.map(item => item.id === id ? ({...item, count: newCount}) : item)}
            } else return category
        })
    } else return data
}

export function setGroceryDataInState(prevGroceryData, resData, mode) {
    let newData
    if (mode === 'delete') {
        newData = prevGroceryData.reduce((accVal, currVal) => {
            if (currVal.id != resData.id) {
                return [...accVal,
                    {
                        ...currVal,
                        items: currVal.items.reduce((a, c) => {
                            return c.id != resData.id ? a.concat(c) : a
                        }, [])
                    }
                ]
            } else {
                return accVal
            }
        }, [])
    } 
    else if (mode === 'add') {
        newData = 
            resData.parent_category_id
            ? prevGroceryData.map(category => 
                category.id === resData.parent_category_id ? ({...category, selected: true, items: category.items.concat(resData)}) : category)
            : prevGroceryData.concat({...resData, selected: true})
    }
    else {
        newData = 
            resData.parent_category_id
                ? prevGroceryData.map(category =>
                    category.id === resData.parent_category_id
                        ? ({ ...category, selected: true, items: category.items.map(item => item.id === resData.id ? resData : item) })
                        : category
                )
                : prevGroceryData.map(category => category.id === resData.id ? {...resData, selected: true} : category)
    }

    const returnData = orderGroceryData(newData)
    return returnData
}

export function setUserEventInState(mode, target, id, groceryData) {
    const initialData = target === 'category' 
        ?
            groceryData.find(c => c.id === id)
        :
            groceryData.filter(c => c.selected)[0]?.items.find(i => i.id === id) 
                ?? {parent_category_id: groceryData.filter(c => c.selected)[0].id}
    return {mode, target, initialData}
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


export function notify(res) {
    const toastStyle = {style: {fontFamily: 'Inter', fontSize: '14px'}}
    if (res.success) {
        toast.success(res.message, toastStyle)
    } else toast.error(res.message, toastStyle)
}
