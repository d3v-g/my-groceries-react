import { supabase } from './supabaseClient'

export async function getUser() {
    const { data } = await supabase.from('profiles').select()
    if (data) {
        return data[0]
    } else return null
}

export async function handleLogIn(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        return {success: false, message: error?.error_description || error?.message}
    } else return {success: true, message: 'log in successful'}
}

export async function handleRegister(email, password, passwordConf) {
    if (password === passwordConf) {
        const { user, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {data: {'email': email} }})
        if (error) {
            return {success: false, message: error?.error_description || error?.message}
        } else return {success: true, message: 'Please check your email for a verification link.'}
    }
    else if (passwordConf && password)
        return {success: false, message: 'Passwords do not match.'}
}

export async function addCategory(name) {
    const {id: user_id} = await getUser()
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
    const {id: user_id} = await getUser()
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
        .order('name', { foreignTable: 'items' })
        .order('name')
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
        return data[0]?.currency
    }
}

export async function updateUserCurrency(currency) {
    const {id: user_id} = await getUser()
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