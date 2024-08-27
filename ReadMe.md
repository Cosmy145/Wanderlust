# Wanderlust

Wanderlust is a web application built with Node.js, Express.js, and MongoDB that allows users to create and manage listings of places they've visited or want to visit.

## Features

* User authentication and authorization using Passport.js
* CRUD operations for listings and reviews
* Flash messages for user feedback
* Session management using Express Sessions and MongoDB

## Installation

To run this project, you'll need to have the following installed:

* Node.js (version 14 or higher)
* MongoDB (version 4 or higher)

 Clone this repository and run the following commands:

```bash
npm install
```

Create a `.env` file in the root directory with the following variables:

* `ATLAS_URL`: Your MongoDB Atlas connection string
* `SECRET`: A secret key for session encryption

Start the server with:

```bash
node app.js
```

## Usage

* Navigate to `http://localhost:3000` to access the application
* Register or login to create and manage listings and reviews
* Use the navigation menu to access different routes

## Routes

* `/listings`: View all listings
* `/listings/:id`: View a single listing
* `/listings/:id/review`: Create a review for a listing
* `/users`: View user profile
* `/users/register`: Register a new user
* `/users/login`: Login to the application

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Passport.js
* EJS templating engine
* Express Sessions
* Flash messages

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork this repository and submit a pull request with your changes.

## Authors

* [Shivansh Kavatra](https://github.com/Cosmy145)