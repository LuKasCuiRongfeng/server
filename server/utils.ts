import mongoDb from "./mongodb";

export function generateCollection<T>(db: string, collection: string) {
    const mongoClient = mongoDb();
    return mongoClient.db(db).collection<T>(collection);
}
export function commonResponse(extra: { data: any }) {
    return {};
}
