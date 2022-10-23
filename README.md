# Online Judge

This is a online judge. It is a web application that allows users to submit solutions to [programming problems](https://en.wikipedia.org/wiki/Competitive_programming) and view the results of their submissions. It is a full-stack web application that uses the following technologies:

- [Express](https://expressjs.com/) (server-side)
- [MongoDB](https://www.mongodb.com/) (database)
- [React](https://reactjs.org/) (client-side)
- [Vite](https://vitejs.dev/) (build tool)

## Installation

Clone the repository and install the dependencies for the server and client.

```bash
git clone https://github.com/Wh4rp/Online-Judge.git
cd Online-Judge
cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables.

```bash
PORT=3000
SECRET=<secret-key-for-jwt>
MONGO_URI=<mongodb-connection-string>
```

- `PORT` is the port that the server will run on.

- `SECRET` can be any string, I used [this page](https://www.javainuse.com/jwtgenerator) to generate a random string.

- `MONGO_URI` can be obtained from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Build and Run

```bash
cd backend
npm run build:ui
npm run dev
```
