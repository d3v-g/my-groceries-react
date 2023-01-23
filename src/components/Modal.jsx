import exitImage from '../assets/exit.png'

export default function Modal({
    onClose, title, children
}) {
    return (
        <div
            className="modal"
            onClick={(e) => {
                console.log(e)
                onClose({canceled: true, data: null})}}
        >
            <div className="modal--content" onClick={(event) => event.stopPropagation()}>
                <div className="modal--header">
                    <h4 className="modal--title">{title}</h4>
                    <button 
                        className='modal--exit'
                        onClick={() => onClose({canceled: true, data: null})}
                    >
                        <img
                            src={exitImage}
                        />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}