# Chat App

A real-time chat application built with Node.js, Express, Socket.io, and MongoDB.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Video Resources](#project-video-resources)

## Features

- Real-time messaging with Socket.io
- User authentication and registration
- Persistent storage of chat messages in MongoDB
- Responsive and intuitive user interface

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Israel-Infinito/FSE-PREP.git

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up MongoDB:

    - Create a MongoDB database and update the connection string in the `config.js` file.

4. Start the application:

    ```bash
    npm start
    ```
    The app will be running at [http://localhost:3000](http://localhost:3000).

## App Structure

- `app.js`: The entry point to the application. This file defines the express server and requires the main routes used in the application.
- `server.js`: This file is responsible for starting the server and handling top-level server errors.
- `package.json`: This file holds various metadata relevant to the project including package dependencies.
- `controllers`: This directory contains files that define the app routes' behavior. 
  - `authController.js`: Handles authentication-related requests such as login and register.
  - `chatController.js`: Handles chat-related requests.
- `models`: This directory contains definitions of the data structures used by the application.
  - `userModel.js`: Defines the structure of a user in the application.
  - `chatModel.js`: Defines the structure of a chat message in the application.
- `routes`: This directory contains files that define the app routes.
  - `authRoutes.js`: Defines routes related to authentication.
  - `chatRoutes.js`: Defines routes related to chat.
- `public`: This directory contains static files served by the server.
  - `html`: Contains HTML files.
    - `login.html`: This renders the login page.
    - `chat.html`: This renders the chat page.
  - `js`: Contains client-side JavaScript files.
    - `login.js`: Handles the behavior of the login page.
    - `register.js`: Handles the behavior of the registration page.
    - `chat.js`: Handles the behavior of the chat page.
  - `css`: Contains CSS files.
    - `style.css`: Defines the styles for the application.
- `config`: This directory contains configuration files for the app.
  - `db.js`: Configures the connection to the database.

## Usage

1. Navigate to [http://localhost:3000](http://localhost:3000) in the browser.
2. Register or log in to start chatting.

## Technologies Used

- Node.js
- Passport.js
- Express.js
- Socket.io
- MongoDB
- HTML, CSS, JavaScript

## Project Video Resources

https://www.youtube.com/watch?v=O5kh3sTVSvA (LOGIN AND REGISTER)
https://www.youtube.com/watch?v=bhiEJW5poHU (MONGODB AND MONGOOSE)
https://www.youtube.com/watch?v=kOJEWNPYBUo (CHAT APP)
https://www.youtube.com/watch?v=ACUXjXtG8J4 (MONGODB CONNECTION)

