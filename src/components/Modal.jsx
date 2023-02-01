import exitImage from '../assets/exit.png'
import ModalForm from './ModalForm'

export default function Modal({
    showModal, onClose, title, userEvent
}) {
    if (showModal) {
        return (
            <div
                className="modal"
                onClick={(e) => {
                    onClose({canceled: true, data: null})}}
            >
                <div className="modal--content" onClick={(event) => event.stopPropagation()}>
                    <div className="modal--header">
                        <h4 className="modal--title">{title?.charAt(0).toUpperCase() + title.slice(1)}</h4>
                        <button 
                            className='modal--exit'
                            onClick={() => onClose({canceled: true, data: null})}
                        >
                            <img
                                src={exitImage}
                            />
                        </button>
                    </div>
                    <ModalForm onClose={onClose} userEvent={userEvent} />
                </div>
            </div>
        )
    }
}