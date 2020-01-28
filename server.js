const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({
    path: './configs/config.env'
})

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

const app = require('./configs/app')

mongoose
    .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() =>
        console.log('DB connection is successful! ')
    )

const port = process.env.PORT || 3000

app.listen(port, () => console.log( `Server is running on port ${port}`))