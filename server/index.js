const express = require("express");
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/index.js')

app.use(cors({ origin: "http://localhost:5173"}));
app.use(express.json());
app.use('/api/v1', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Connecting Server....`))
