import DeleteForm from "../forms/DeleteForm"
import CategoryForm from "../forms/CategoryForm"
import ItemForm from "../forms/ItemForm"

export default function ModalForm({ onClose, userEvent }) {

    if (userEvent.mode === 'delete') {
        return (
            <DeleteForm
                initialData={userEvent.initialData}
                onSubmit={onClose} 
                target={userEvent.target}
            />)
    }
    else if (userEvent.target === 'category') {
        return (
            <CategoryForm
                initialData={userEvent.initialData}
                onClose={onClose}
                mode={userEvent.mode}
            />
        )
    }
    else if (userEvent.target === 'item') {
        return (
            <ItemForm
                initialData={userEvent.initialData}
                onClose={onClose}
                mode={userEvent.mode}
            />
        ) 
    }
}