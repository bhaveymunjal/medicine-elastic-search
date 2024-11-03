const express = require('express');
const routes = require('./Routers/routes')
const cors = require('cors')
require('dotenv').config();
// require('./Utils/loadData')

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
