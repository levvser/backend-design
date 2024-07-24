import { EntityManager } from "typeorm";
import { TransactionBaseService } from "@medusajs/medusa";
import { Product } from "@medusajs/medusa/dist/models/product";
import { ProductService as MedusaProductService } from "@medusajs/medusa/dist/services";
import { UpdateProductInput } from "@medusajs/medusa/dist/types/product";

interface InjectedDependencies {
  manager: EntityManager;
  productRepository: typeof MedusaProductService;
}

class CustomProductService extends MedusaProductService {
  protected manager_: EntityManager;

  constructor({ manager, productRepository }: InjectedDependencies) {
    super({ manager, productRepository });

    this.manager_ = manager;
  }

  async create(data: any): Promise<Product> {
    const productRepo = this.manager_.getCustomRepository(this.productRepository_);

    const created = productRepo.create(data);

    if (data.customAttribute) {
      created.customAttribute = data.customAttribute;
    }

    const product = await productRepo.save(created);

    return product;
  }

  async update(productId: string, update: UpdateProductInput & { customAttribute?: string }): Promise<Product> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_);

      const product = await this.retrieve(productId, { relations: ["variants", "tags"] });

      if (update.customAttribute !== undefined) {
        product.customAttribute = update.customAttribute;
      }

      const result = await productRepo.save(product);
      return result;
    });
  }
}

export default CustomProductService;
