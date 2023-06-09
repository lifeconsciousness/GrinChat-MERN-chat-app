const express = require('express')
const dotenv = require('dotenv')
const { chats } = require('./data/data')
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

dotenv.config()
connectDB()
const app = express()

app.use(express.json()) //accept json data

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

// app.get('/api/chat', (req, res) => {
//   res.send(chats)
// })

// app.get('/api/chat/:id', (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id)
//   res.send(singleChat)
// })

const PORT = process.env.PORT || 10000

app.listen(7000, console.log(`Server stared on PORT ${PORT}`.yellow.bold))
