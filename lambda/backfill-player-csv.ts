import * as csv from "csv-parser";
import { BatchStreamTransform } from "./batching-stream-transform";
import { SequentialStreamHandler } from "./sequential-stream-handler";
import { DynamoDBManager } from "./ddb-manager";

export interface CsvData {
    [key: string]: string | number | Date;
}

export class BackfillPlayerCsvStreamToDDB {

    private ddbManager: DynamoDBManager;

    private readonly PLAYER_CSV_HEADERS: string[] = [
        'playerID', 'birthYear', 'birthMonth', 'birthDay', 'birthCountry',
        'birthState', 'birthCity', 'deathYear', 'deathMonth', 'deathDay',
        'deathCountry', 'deathState', 'deathCity', 'nameFirst', 'nameLast',
        'nameGiven', 'weight', 'height', 'bats', 'throws', 'debut',
        'finalGame', 'retroID', 'bbrefID'
    ];

    private mapPlayerCsvTypes(csvData: CsvData): CsvData {
        const fieldTypes: Record<string, 'Number' | 'Date'> = {
            birthYear: "Number",
            birthMonth: "Number",
            birthDay: "Number",
            weight: "Number",
            height: "Number",
            debut: "Date",
            finalGame: "Date",
        };

        const convertedData: CsvData = { ...csvData };

        Object.entries(fieldTypes).forEach(([fieldName, fieldType]) => {
            if (convertedData[fieldName as keyof CsvData] !== undefined) {
                if (fieldType === "Number") {
                    convertedData[fieldName as keyof CsvData] = Number(convertedData[fieldName as keyof CsvData]);
                } else if (fieldType === "Date") {
                    convertedData[fieldName as keyof CsvData] = new Date(convertedData[fieldName as keyof CsvData]);
                }
            }
        });

        return convertedData;
    };

    constructor(private stream: NodeJS.ReadableStream,
                private pauseResumeStream: boolean,
                private destinationTableName: string) {
        this.ddbManager = new DynamoDBManager();
    }

    public async process(): Promise<void> {
        let totalProcessed = 0;
        let batchCount = 0;

        const batchCsvRecordStream = new BatchStreamTransform(
            this.ddbManager.BATCH_MAXIMUM_SIZE,
            (item: any) => ({
                PutRequest: {
                    Item: this.mapPlayerCsvTypes(item),
                },
            }),
            true
        );

        const sequentialStreamReader = new SequentialStreamHandler(async (item: any[]) => {
            totalProcessed += item.length;
            batchCount += 1;
            console.log(`Upserting ${item.length} items to the db. Batch count: ${batchCount}`);
            await this.ddbManager.putRateLimitedBatch(item, this.destinationTableName);
        });

        const csvPipeReader = this.stream.pipe(csv({ headers: this.PLAYER_CSV_HEADERS })).pipe(batchCsvRecordStream);

        return new Promise<void>((resolve, reject) => {
            sequentialStreamReader.asyncIterateSequentially(csvPipeReader, this.pauseResumeStream).then(() => resolve());
        });
    }
}
