const express = require("express");

const app = express();

const dbConfig = require('./db')
const roomsRoute = require('./routes/roomsRoute')
const usersRoute = require('./routes/usersRoute')
const bookingRoute = require('./routes/bookingsRoute')
app.use(express.json())

app.use('/api/rooms', roomsRoute)
app.use('/api/users', usersRoute)
app.use('/api/bookings', bookingRoute)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Node server started'));
console.log(port)