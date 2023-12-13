# Movie Management Service

Movie Management Service is a CRUD (Create, Read, Update, Delete) application built using the Node.js framework. It provides a set of APIs for managing movie records with features like concurrency handling and optimization using Redis.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: [Download Node.js](https://nodejs.org/)
- MongoDB: [Download MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie-management-svc.git

2. Navigate to the project directory:

    ```bash
    cd movie-management-svc

3. Install dependencies:

    ```bash
    npm install
4. Create a .env file in the root directory and configure your environment variables:
    ```bash
    PORT=3001
    REDIS_URI=redis://localhost:6379
    MONGO_URI=mongodb://localhost/movieDB
    API_KEY=12342atsdyau
    ```

5. Start the server:
    ```bash
    npm start
    ```
6. Usage
    Access the service at http://localhost:3001.
    Explore the CRUD APIs for managing movie records.


### API Endpoints
    Create Movie: POST /movies
    Read Movies: GET /movies
    Update Movie: PATCH /movies/:id
    Delete Movie: DELETE /movies/:id