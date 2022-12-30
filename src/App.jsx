import { useState, useEffect } from 'react'
import { BrowserRouter as Router,
          Route,
          Routes
} from 'react-router-dom'
import { nanoid } from 'nanoid'
import { supabase } from './supabaseClient'
import Cookies from 'js-cookie'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts/browser";

function App() {
  const [userId, setUserId] = useState(Cookies.get('user_id'))

  useEffect(() => {

    setUserId(Cookies.get('user_id'))

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // delete cookies on sign out
          Cookies.remove('user_id')
          setUserId(null)
          // const expires = new Date(0)
          Cookies.remove('access-token')
          // Cookies.set('my-refresh-token', null, { expires: expires, path: '/', SameSite: 'lax', secure: true })
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // set or renew user session
          const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
          
          const salt = genSaltSync(10)
          const hash = hashSync(session.user.id, salt)

          Cookies.set('user_id', hash)
          setUserId(Cookies.get('user_id'))
          Cookies.set('access-token', session.access_token, { expires: maxAge, secure: true})
          // Cookies.set('my-refresh-token', session.refresh_token, { expires: maxAge, secure: true })
        }
      }
  )
      return () => {
        authListener?.unsubscribe
      }
  }, [userId])

  return (
        <Router>
      <div className="App">
        <main>
          <Navbar userLoggedIn={userId != null ? true : false} logOut={() => supabase.auth.signOut()}/>
          <Routes>
            <Route path='/login' element={<Auth userLoggedIn={userId ? true : false} />} />
            <Route path='/' element={<Home userLoggedIn={userId ? true : false} />} />
          </Routes>
        </main>
      </div>
        </Router>
  )
}

export default App
