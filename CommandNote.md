## How to run the project

### 1. Start and install JSON Server
Check package.json file to make sure you have the json server if not read below.
To make sure the project run correctly please install this json server version with the following command:
npm install json-server@0.17.4 --save-dev

Run the following command to start the database:
npx json-server --watch api/db.json --port 8000

If you want to use another port, remember to update the API base URL in all hooks files.

### 2. Start React Vite application
Open another terminal and run:
npm run dev

The application will be available at:
http://localhost:5173