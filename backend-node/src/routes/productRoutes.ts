import { Router } from "express";
import { getAllProductsController, createProductController, getProductByIdController} from '../controllers/productController'



const router = Router();

router.get('/', getAllProductsController);

router.get('/:id', getProductByIdController);

router.post('/', createProductController);

export default router;