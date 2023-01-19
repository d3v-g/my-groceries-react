import { useState, useEffect } from 'react'
import { BrowserRouter as Router,
          Route,
          Routes
} from 'react-router-dom'
import { supabase } from './supabaseClient'
import Cookies from 'js-cookie'
import { getUserId } from './api.js'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    getUserId()
      .then(id => setUserId(id))

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          Cookies.remove('user_id')
          setUserId(null)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          Cookies.set('user_id', session.user.id)
          setUserId(Cookies.get('user_id'))
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
              <Navbar userLoggedIn={userId ? true : false} logOut={() => supabase.auth.signOut()}/>
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
