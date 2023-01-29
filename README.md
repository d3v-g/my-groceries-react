# my-groceries-react

## Video Demo
https://youtu.be/mn088Sh1fNE

## About this project/Description

This project forms part of my CS50 final project. Written in React, this web app allows users to create an account and manage their groceries based on specific categories. With this project, I am aiming to create an easy to use application with robust functionality, which will make budgeting, planning groceries a much more pleasant experience.

## How to run
### Prerequisites 
- Node >=v16

### Environment Variables:

| Environment Variable | Explanation |
|---|---|
| VITE_PUBLIC_REACT_APP_SUPABASE_URL | Connection string for Supabase Backend API |
| VITE_PUBLIC_REACT_APP_SUPABASE_ANON_KEY | Unique auth key (JWT) to communicate with Supabase API |

### Development Mode:
```node
npm run dev
```

### Production Mode:
```node
npm run build
```


## Tech used
- [Vite](https://vitejs.dev/) (Frontend Build Tool)
- React v18
- [Supabase backend](https://supabase.com/)
  - Postgress Database 
  - User authentication (email, magic link, etc) and authorisation (via Row Level Security)
  - Relational DB Schemas
- Netlify (production web server)
- [Github actions](.github/workflows/production.yml) (CI/CD Pipeline)

## Planning to implement
- CircleCI -> Different Continuous Integration Tool
- Dependabot -> automatically update dependencies
- Cypress Smoke Tests -> browser automation to test functionality
- Security Scanning Tools -> scan for potential threats 
- Unit Tests -> test small units of code that build up each components logic
- Pre-commit hooks -> Pre Commit Framework to automate running tests before commit, formating and linting code.