import { Router } from 'express'
import { upload } from '../multer/upload.js'
import { CreateBlocosController } from '../controller/create-blocos-controller.js'
import { FindManyBlocosController } from '../controller/find-many-blocos-controller.js'
import { DeleteBlocosController } from '../controller/delete-blocos-controller.js'

export const blocosRoutes = Router()

const creataeBlocosController = new CreateBlocosController()
const findManyBlocosController = new FindManyBlocosController()
const deleteBlocosController = new DeleteBlocosController()

blocosRoutes
    .post('/',  upload.single('image'), async (req, res) =>  await creataeBlocosController.post(req, res))
    .get('/', async(req, res) =>  await findManyBlocosController.get(req, res))
    .delete('/:id', async (req, res) =>  await deleteBlocosController.remove(req, res))