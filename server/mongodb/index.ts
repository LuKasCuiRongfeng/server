import { MongoClient } from "mongodb";

const uri =
    "mongodb+srv://cuirongfeng:hurricane0801@crfcloudcluster.ykifm.mongodb.net/?retryWrites=true&w=majority";

export default function mongoDb() {
    try {
        const mongoClient = new MongoClient(uri);
        return mongoClient;
    } catch (err) {
        throw new Error(err);
    }
}
