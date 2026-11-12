import { Router } from "express";
import { getAllProductsController, getProductByIdController} from '../controllers/productController'

const router = Router();

router.get('/', getAllProductsController);

router.get('/:id', getProductByIdController);

export default router;