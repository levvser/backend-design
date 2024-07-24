import { Router } from "express";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CustomProductService from "../../../services/custom-product-service";
import { EntityManager } from "typeorm";

const route = Router();

route.get("/", async (req: MedusaRequest, res: MedusaResponse) => {
  const productService: CustomProductService = req.scope.resolve("productService");

  const products = await productService.list({});

  res.status(200).json({ products });
});

route.post("/", async (req: MedusaRequest, res: MedusaResponse) => {
  const productService: CustomProductService = req.scope.resolve("productService");
  const manager: EntityManager = req.scope.resolve("manager");

  const product = await manager.transaction(async (transactionManager) => {
    return await productService.withTransaction(transactionManager).create(req.body);
  });

  res.status(201).json({ product });
});

route.get("/:id", async (req: MedusaRequest, res: MedusaResponse) => {
  const productService: CustomProductService = req.scope.resolve("productService");

  const product = await productService.retrieve(req.params.id, {
    relations: ["variants", "tags"],
  });

  res.status(200).json({ product });
});

route.put("/:id", async (req: MedusaRequest, res: MedusaResponse) => {
  const productService: CustomProductService = req.scope.resolve("productService");
  const manager: EntityManager = req.scope.resolve("manager");

  const product = await manager.transaction(async (transactionManager) => {
    return await productService.withTransaction(transactionManager).update(req.params.id, req.body);
  });

  res.status(200).json({ product });
});

export default (app) => {
  app.use("/admin/products", route);

  return app;
};
