import { PrismaClient } from "@prisma/client";

export class PrismaSingleton {
  private static session: PrismaClient | null = null;

  static getSession(): PrismaClient {
    if (!PrismaSingleton.session) {
      PrismaSingleton.session = new PrismaClient();
    }

    return PrismaSingleton.session;
  }
}