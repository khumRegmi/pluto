import { createConnection } from "typeorm";

import {
  User,
  Product,
  Blog,
  ProductImage,
  Offer,
  Order,
  OrderedProduct,
  Category,
  Address,
} from "../entity";

export function connectDatabase() {
  return createConnection({
    type: "sqlite",
    database: "./db.sqlite",
    entities: [
      User,
      Product,
      Blog,
      ProductImage,
      Offer,
      Category,
      Order,
      OrderedProduct,
      Address,
    ],
    synchronize: true,
  });
}