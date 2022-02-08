const express = require('express');
const app = express();
const cors = require('cors');
const app = express ()
const connectDb = require("./db/db")
const userRouter = require("./routes.users")

connectDb()


app.use(cors())
app.use(express.json)
app.use(`/api/users`,userRouter)



const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server started on port: ${port}`)
})