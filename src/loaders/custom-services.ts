import { asClass } from "awilix";
import CustomProductService from "../services/custom-product-service";

export default ({ container }) => {
  container.register({
    productService: asClass(CustomProductService).singleton(),
  });
};
