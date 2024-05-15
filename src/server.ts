import { env } from './env.js'
import express from 'express'
import { blocosController } from './controller/blocos-controller.js'
import { upload } from './multer/upload.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const port = env.PORT || 8080

app.post('/api/blocos', upload.single('image'), async (req, res) => {

    await blocosController.post(req, res)
})

app.get('/api/blocos', async (req, res) => {
    await blocosController.get(req, res)
})

app.delete('/api/blocos/:id', async(req, res) => {
    await blocosController.remove(req, res)
})

app.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`)
})