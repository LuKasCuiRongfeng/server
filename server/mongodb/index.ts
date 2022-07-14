import { MongoClient } from "mongodb";

const uri =
    "mongodb+srv://cuirongfeng:hurricane0801@crfcloudddb.uj1uf.mongodb.net/?retryWrites=true&w=majority";

export class MongoDb {
    private client: MongoClient;
    constructor() {
        this.client = new MongoClient(uri);
    }

    /** 连接数据库 */
    connectDb(db: string) {
        return this.client.db(db);
    }

    async close() {
        await this.client.close();
    }
}
