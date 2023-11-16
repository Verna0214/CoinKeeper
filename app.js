// include related modules
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')

require('./config/mongoose')
const routes = require('./routes')
const app = express()
const port = process.env.PORT

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
    console.info(`App is running on http://localhost:${port}`)
})