const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const routes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
})
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use((req, res, next) => {
    req.user = {
      _id: '618bee8abc0b8bac4b22bf6f'
    };
  
    next();
});
app.use(routes)

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})