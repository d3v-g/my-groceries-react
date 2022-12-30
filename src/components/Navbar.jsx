import { Link } from 'react-router-dom'

export default function Navbar({ userLoggedIn, logOut}) {
    return (
            <div className="navbar">
                <p className="navbar--title">
                    <Link to='/'>
                        MyGroceries
                    </Link>
                </p>
                {userLoggedIn
                    ? <p onClick={logOut} style={{cursor: "pointer"}}>Log out</p>
                    : <Link to='/login'>Log in</Link>}
            </div>
    )
}