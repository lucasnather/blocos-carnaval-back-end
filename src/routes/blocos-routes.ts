import { Router } from 'express'
import { BlocosController } from '../controller/blocos-controller.js'
import { upload } from '../multer/upload.js'
import { CreateBlocosController } from '../controller/create-blocos-controller.js'
export const blocosRoutes = Router()

const blocosController = new BlocosController()
const cretaeBlocosController = new CreateBlocosController()


blocosRoutes
    .post('/',  upload.single('image'), async (req, res) =>  await cretaeBlocosController.post(req, res))
    .get('/', async(req, res) =>  await blocosController.get(req, res))
    .delete('/:id', async (req, res) =>  await blocosController.remove(req, res))