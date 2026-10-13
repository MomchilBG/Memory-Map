import { Inject, Injectable } from "@nestjs/common";
import { DATABASE, type Database } from "./database/database.module.js";
import { greetings } from "./database/schema.js";

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async getHello(): Promise<string> {
    const [greeting] = await this.db.select().from(greetings).limit(1);

    return greeting.message;
  }
}
