import express from 'express'

const app = express ();

console.log(app);

const port = 3000

app.listen(port, () => {
    console.log(`servier running on port ${port}`)
})