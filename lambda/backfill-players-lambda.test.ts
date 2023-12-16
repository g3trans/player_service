import {BackfillPlayerCsvStreamToDDB} from './backfill-player-csv';
import {DynamoDBManager} from "./ddb-manager";

const fs = require('fs');

const originalBatchStreamTransform = require('./batching-stream-transform');
const originalSequentialStreamHandler = require('./sequential-stream-handler');
const originalDynamoDBManager = require('./ddb-manager');

describe('BackfillPlayerCsvS3ToDDB', () => {
    let pauseResumeStream: boolean;
    let destinationTableName: string;

    const mockBatchStreamTransform = jest.fn().mockImplementation(() => {
        const mockInstance = {
            on: jest.fn(),
            once: jest.fn(),
            emit: jest.fn(),
            _transform: jest.fn()
        };
        return mockInstance;
    });

    jest.mock('./batching-stream-transform', () => ({
        ...originalBatchStreamTransform,
        BatchStreamTransform: mockBatchStreamTransform,
    }));

    const mockSequentialStreamHandler = jest.fn().mockImplementation(() => {
        return {
            async asyncIterateSequentially(items: any, pauseResume: boolean) {
                return Promise.resolve();
            },
        };
    });

    jest.mock('./sequential-stream-handler', () => ({
        ...originalSequentialStreamHandler,
        SequentialStreamHandler: mockSequentialStreamHandler,
    }));

    const mockDynamoDBManager = jest.fn().mockImplementation(() => {
        return {
        };
    });

    jest.mock('./ddb-manager', () => ({
        ...originalDynamoDBManager,
        DynamoDBManager: mockDynamoDBManager,
    }));

    beforeEach(() => {
        process.env.BATCH_SIZE = '25';

        pauseResumeStream = false;
        destinationTableName = 'mockTableName';
        mockBatchStreamTransform.mockClear();
        mockDynamoDBManager.mockClear();
        mockSequentialStreamHandler.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete process.env.BATCH_SIZE;
    });

    it('should process CSV records and upsert them to DynamoDB', async () => {
        expect(mockBatchStreamTransform).not.toHaveBeenCalled();
        expect(mockSequentialStreamHandler).not.toHaveBeenCalled();
        expect(mockDynamoDBManager).not.toHaveBeenCalled();

        const readableStream = fs.createReadStream('./test.csv')
        const backfillPlayerCsvS3ToDDB = new BackfillPlayerCsvStreamToDDB(readableStream, pauseResumeStream, destinationTableName);

        // todo - expand with e2e unit tests that verify backfillPlayerCsvS3ToDDB process expects ddb
    });
});