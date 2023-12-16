export declare class DynamoDBManager {
    private ddb;
    private readonly WCU_RATE_LIMITING_SLEEP;
    readonly BATCH_MAXIMUM_SIZE = 25;
    constructor();
    putRateLimitedBatch(batchArray: any[], tableName: string): Promise<void>;
    private putBatch;
}
