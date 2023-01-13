import { supabase } from './supabaseClient'

const { data } = await supabase.from('profiles').select('*')
const user_id = data[0].id

export async function addCategory(name) {
    const { data, error } = await supabase
        .from('categories')
        .insert({ name, user_id })
        .select()
    if (error) {
        console.error(error)
    } else return data[0]
}

export async function updateCategory(name, id) {
    const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select()
    if (error) {
        console.error(error)
    } else return data[0]
}

export async function addItem(name, price, note, parent_category_id) {
    const { data, error } = await supabase
        .from('items')
        .insert({ name, price, note, count: 1, user_id, parent_category_id })
        .select()
    if (error) {
        console.error(error)
    } else return data[0]
}

export async function updateItem(name, price, note, id) {
    const { data, error } = await supabase
        .from('items')
        .update({ name, price, note })
        .eq('id', id)
        .select()
    if (error) {
        console.error(error)
    } else return data[0]
}

export async function handleDelete(target, id) {
    const { error } = await supabase
        .from(target === 'category' ? 'categories' : 'items')
        .delete()
        .eq('id', id)
    if (error) {
        console.error(error)
    }
}    

export async function addItemCount(id, initialCount) {
        const { data, error } = await supabase
            .from('items')
            .update({ count: initialCount + 1 })
            .eq('id', id)
            .select()
        if (error) {
            console.error(error)
        } else return data[0].count
}

export async function subtractItemCount(id, initialCount) {
    if (initialCount != 0) {
        const { data, error } = await supabase
            .from('items')
            .update({ count: initialCount - 1 })
            .eq('id', id)
            .select()
        if (error) {
            console.error(error)
        } else return data[0].count
    } else return 0
}

// todo: order items by 'created_at'
export async function generateList() {
    const { data, error } = await supabase
        .from('categories')
        .select(`
            name,
            id,
            items (
                id,
                name,
                note,
                count,
                price
            )
        `)
        .order('count', { foreignTable: 'items', ascending: false })
        .order('created_at')
    if (error) {
        console.error(error)
    } else {
        return data
    }
}

export async function getUserCurrency() {
    const { data, error } = await supabase
        .from('profiles')
        .select('currency')
    if (error) {
        console.error(error)
    } else {
        return data[0].currency
    }
}

export async function updateUserCurrency(currency) {
    const { data, error } = await supabase
        .from('profiles')
        .update({currency: currency})
        .eq('id', user_id)
        .select('currency')
    if (error) {
        console.error(error)
    } else {
        return data[0].currency
    }
}