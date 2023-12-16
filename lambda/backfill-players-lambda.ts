const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const { BackfillPlayerCsvStreamToDDB } = require("./backfill-player-csv");
import { S3Event, Context } from 'aws-lambda';

export const handler = async (event: S3Event, context: Context) => {
    if (!process.env.ORIGIN_BUCKET_NAME) {
        throw new Error("Origin bucket name is not provided");
    }
    if (!process.env.DESTINATION_TABLE_NAME) {
        throw new Error("Destination table name is not provided");
    }
    const bucketName = process.env.ORIGIN_BUCKET_NAME;
    const objectKey = event.Records[0].s3.object.key;
    const s3Stream = await s3.getObject({ Bucket: bucketName, Key: objectKey }).createReadStream();


    const backfillPlayerCsv = new BackfillPlayerCsvStreamToDDB(
        s3Stream,
        false,
        process.env.DESTINATION_TABLE_NAME
    );

    await backfillPlayerCsv.process();

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: ``,
    };
};
