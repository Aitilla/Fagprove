# This is the repo for my fagprøve within It-development

# Intro

In this project I will be using everything I have learned from being an apprentice at the University of Oslo to create my fagprøve.

I have been an apprentice since Aug.14th/2023 and will end my time here by Aug.13th/2025

This project have been done between June.2nd/2025 - June.11th/2025

# Packages and tech

This project uses node and npm, which are required to run the application

I am using Nextjs as my framework

I will be using entur api for my ruter applications

- This is for public transport
- [Entur](https://developer.entur.org/pages-real-time-intro)

I will be using Supabase as my database provider

- This will be for authentication
- [Supabase](https://supabase.com/)

For encrypting/Hashing passwords and sessions I will be using bcrypt

- An easy way of encryption and comparing for validation
  [Bcrypt](https://www.npmjs.com/package/bcrypt)

# How to set up

1. Clone github repository

2. Go to the root folder of the project in your preffered terminal

3. Type: "npm i" this will install reqired packages

4. You will need to create your own supabase database
   - This have to be same setup as me. You can find this in my documentation

5. Create a .env.local file in the root folder and add.

   - NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY
   - NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_KEY

7. Go to root in your terminal and type: "npm run dev" this will run a localhost of the project

# Sources:

- Supabase documentation
- bcrypt documentation
- Entur documentation
- Nextjs documentation
- xml2js documentation
- ChatGPT
- Rubix cube as rubber ducky :D