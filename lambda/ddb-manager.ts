import { DynamoDB } from "aws-sdk";

export class DynamoDBManager {
    private ddb: DynamoDB.DocumentClient;

    private readonly WCU_RATE_LIMITING_SLEEP = 2000;
    public readonly BATCH_MAXIMUM_SIZE = 25;

    constructor() {
        this.ddb = new DynamoDB.DocumentClient();
    }

    public async putRateLimitedBatch(batchArray: any[], tableName: string) {
        return new Promise<void>(resolve => {
            console.log(`Batch writing: ${JSON.stringify(batchArray)}`);

            try {
                this.putBatch(batchArray, tableName).then(() => {
                    setTimeout(() => {
                        resolve();
                    }, this.WCU_RATE_LIMITING_SLEEP);
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        });
    };

    private async putBatch(batchArray: any[], tableName: string) {
        const params = {
            RequestItems: {
                [tableName]: batchArray
            }
        };

        try {
            await this.ddb.batchWrite(params).promise();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
