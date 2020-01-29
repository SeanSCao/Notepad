# Notepad

## [Project Deployed Here](https://notepad-a086b.firebaseapp.com/)

### Notepad is a rich text editor that is coupled with a user created dictionary of items that can be referenced within notes using a Facebook mentions-like feature.

## Dependencies
- Front-end:
    - React
    - Bootstrap 4
- Firebase
    - Using Realtime Database to store data
    - User authentication
- Slate.js
    - Flexible rich text editor

## Data model

The application will store users, each of which will have multiple notebooks containing notes that will be linked to dictionaries.

- Users
    - Notebooks
        - Notes
            - Linked to dictionary
    - Dictionaries
        - Items

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!