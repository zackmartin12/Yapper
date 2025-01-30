const express = require('express');
const app = express();
app.use(express.json())

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const routes = require('./routes/routes');
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));