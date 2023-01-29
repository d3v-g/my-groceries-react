import { useState, useEffect } from 'react'
import { BrowserRouter as Router,
          Route,
          Routes
} from 'react-router-dom'
import { supabase } from './supabaseClient'
import { getUser } from './api.js'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      getUser()
        ?.then(user => setUser(user))
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setUser(null)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          getUser()
            .then(user => setUser(user))
        }
      }
  )
      return () => {
        authListener?.unsubscribe
      }
  }, [user])

  return (
        <Router>
          <div className="App">
            <main>
              <Navbar userLoggedIn={user ? true : false} logOut={() => supabase.auth.signOut()}/>
              <Routes>
                <Route path='/login' element={<Auth userLoggedIn={user ? true : false} />} />
                <Route path='/' element={<Home user={user} />} />
              </Routes>
            </main>
          </div>
        </Router>
  )
}

export default App
