import { supabase } from './supabaseClient'

export async function getCategories() {
    const { data } = await supabase.from('categories')
        .select('name, id')
        .order('created_at')
    return data
}

export async function getItems(parentCategoryId) {
    const { data } = await supabase.from('items')
        .select('id, name, note, count')
        .eq('parent_category_id', parentCategoryId)
        .order('created_at')
    return data
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
                count
            )
        `)
        .order('created_at')
    if (error) {
        console.error(error)
    } else {
        return data
    }
}