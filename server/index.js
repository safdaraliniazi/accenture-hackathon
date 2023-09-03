const express = require('express')
const app = express()

// Path: server/index.js
// const path = require('path')
// app.use(express.static(path.join(__dirname, '../client/build')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'))
//     }
// )

// Path: server/index.js

app.get('/api/hello', (req, res) => {
    res.send("testing get fucntion from server")
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
