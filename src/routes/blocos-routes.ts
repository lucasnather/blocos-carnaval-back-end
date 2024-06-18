import { Router } from 'express'
import { BlocosController } from '../controller/blocos-controller.js'
import { upload } from '../multer/upload.js'
import { CreateBlocosController } from '../controller/create-blocos-controller.js'
import { FindManyBlocosController } from '../controller/find-many-blocos-controller.js'
export const blocosRoutes = Router()

const blocosController = new BlocosController()
const creataeBlocosController = new CreateBlocosController()
const findManyBlocosController = new FindManyBlocosController()


blocosRoutes
    .post('/',  upload.single('image'), async (req, res) =>  await creataeBlocosController.post(req, res))
    .get('/', async(req, res) =>  await findManyBlocosController.get(req, res))
    .delete('/:id', async (req, res) =>  await blocosController.remove(req, res))