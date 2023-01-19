# my-groceries-react
## About this project

This project forms part of my CS50 final project. Written in React, this web app allows users to create an acount and manage their groceries based on specific categories. With this project, I am aiming to create an easy to use application with robust functionalities, which will make budgeting, planning groceries a much more pleasant experience.

## How to run
### Environment Variables:

Connection string for Supabase Backend API
- VITE_PUBLIC_REACT_APP_SUPABASE_URL

Unique auth key (JWT) to communicate with Supabase API  
- VITE_PUBLIC_REACT_APP_SUPABASE_ANON_KEY


### Development Mode:
```node
npm run dev
```

### Production Mode:
```node
npm run build
```

Which versions to run on:

## How to test

## Tech used
- [Vite](https://vitejs.dev/) (Frontend Build Tool)
- React v18
- [Supabase backend](https://supabase.com/)
  - Postgress Database 
  - User authentication (email, magic link, etc) and authorisation (via Row Level Security)
  - Relational DB Schemas
- Netlify (production web server)
<!-- - Renovate as the dependency update manager -->
- Github actions (CI/CD Pipeline) and CircleCI
