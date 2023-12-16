import { S3Event, Context } from 'aws-lambda';
export declare const handler: (event: S3Event, context: Context) => Promise<{
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
}>;
