import { MongoClient } from "mongodb";

const uri =
    "mongodb+srv://cuirongfeng:hurricane0801@crfcloudcluster.ykifm.mongodb.net/?retryWrites=true&w=majority";

let mongoClient: MongoClient;

export default function mongoDb() {
    try {
        if (mongoClient == null) {
            mongoClient = new MongoClient(uri);
        }
        return mongoClient;
    } catch (err) {
        throw new Error(err);
    }
}
