"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDatabaseBackfillStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_s3_notifications_1 = require("aws-cdk-lib/aws-s3-notifications");
class PlayerDatabaseBackfillStack extends aws_cdk_lib_1.NestedStack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const bucket = new aws_s3_1.Bucket(this, 'PlayerDBBackfillBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY
        });
        const lambdaFunc = new aws_lambda_1.Function(this, 'PlayerDBBackfillHandler', {
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
            code: aws_lambda_1.Code.fromAsset('lambda'),
            handler: 'backfill-players-lambda.handler',
            environment: {
                DESTINATION_TABLE_NAME: props.destinationTable.tableName,
                ORIGIN_BUCKET_NAME: bucket.bucketName
            },
            // Backfill takes 150~ entries 8 seconds => 15k 800~ seconds
            // Csv is 20k, will backfill 10k at a time.
            // Can implement batching to improve performance but it's a one off.
            timeout: aws_cdk_lib_1.Duration.seconds(900),
        });
        // Grant the lambda function the permissions to read/write from the S3 bucket and DynamoDB table
        bucket.grantReadWrite(lambdaFunc);
        props.destinationTable.grantReadWriteData(lambdaFunc);
        // Add notification for the S3 bucket to trigger the lambda function
        bucket.addEventNotification(aws_s3_1.EventType.OBJECT_CREATED_PUT, new aws_s3_notifications_1.LambdaDestination(lambdaFunc), { suffix: '.csv' });
    }
}
exports.PlayerDatabaseBackfillStack = PlayerDatabaseBackfillStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLWRhdGFiYXNlLWJhY2tmaWxsLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxheWVyLWRhdGFiYXNlLWJhY2tmaWxsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFtRjtBQUNuRiwrQ0FBcUQ7QUFHckQsdURBQStEO0FBRS9ELDJFQUFtRTtBQVFuRSxNQUFhLDJCQUE0QixTQUFRLHlCQUFXO0lBQzFELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUM7UUFDL0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ3hELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUMvRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDOUIsT0FBTyxFQUFFLGlDQUFpQztZQUMxQyxXQUFXLEVBQUU7Z0JBQ1gsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVM7Z0JBQ3hELGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxVQUFVO2FBQ3RDO1lBQ0QsNERBQTREO1lBQzVELDJDQUEyQztZQUMzQyxvRUFBb0U7WUFDcEUsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUMvQixDQUFDLENBQUM7UUFFSCxnR0FBZ0c7UUFDaEcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEQsb0VBQW9FO1FBQ3BFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksd0NBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNuSCxDQUFDO0NBQ0Y7QUE1QkQsa0VBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEdXJhdGlvbiwgTmVzdGVkU3RhY2ssIE5lc3RlZFN0YWNrUHJvcHMsIFJlbW92YWxQb2xpY3l9IGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHtCdWNrZXQsIEV2ZW50VHlwZX0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0IHtDb25zdHJ1Y3R9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XHJcbmltcG9ydCB7VnBjfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjMlwiO1xyXG5pbXBvcnQge0NvZGUsIEZ1bmN0aW9uLCBSdW50aW1lfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xyXG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7TGFtYmRhRGVzdGluYXRpb259IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtczMtbm90aWZpY2F0aW9uc1wiO1xyXG5pbXBvcnQge0Vudmlyb25tZW50UHJvcHN9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5pbnRlcmZhY2UgUGxheWVyRGF0YWJhc2VCYWNrZmlsbFN0YWNrUHJvcHMgZXh0ZW5kcyBOZXN0ZWRTdGFja1Byb3BzLCBFbnZpcm9ubWVudFByb3BzIHtcclxuICB2cGM6IFZwYztcclxuICBkZXN0aW5hdGlvblRhYmxlOiBUYWJsZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllckRhdGFiYXNlQmFja2ZpbGxTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUGxheWVyRGF0YWJhc2VCYWNrZmlsbFN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgJ1BsYXllckRCQmFja2ZpbGxCdWNrZXQnLCB7XHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBsYW1iZGFGdW5jID0gbmV3IEZ1bmN0aW9uKHRoaXMsICdQbGF5ZXJEQkJhY2tmaWxsSGFuZGxlcicsIHtcclxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTZfWCxcclxuICAgICAgY29kZTogQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxyXG4gICAgICBoYW5kbGVyOiAnYmFja2ZpbGwtcGxheWVycy1sYW1iZGEuaGFuZGxlcicsXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgREVTVElOQVRJT05fVEFCTEVfTkFNRTogcHJvcHMuZGVzdGluYXRpb25UYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgICAgT1JJR0lOX0JVQ0tFVF9OQU1FOiBidWNrZXQuYnVja2V0TmFtZVxyXG4gICAgICB9LFxyXG4gICAgICAvLyBCYWNrZmlsbCB0YWtlcyAxNTB+IGVudHJpZXMgOCBzZWNvbmRzID0+IDE1ayA4MDB+IHNlY29uZHNcclxuICAgICAgLy8gQ3N2IGlzIDIwaywgd2lsbCBiYWNrZmlsbCAxMGsgYXQgYSB0aW1lLlxyXG4gICAgICAvLyBDYW4gaW1wbGVtZW50IGJhdGNoaW5nIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UgYnV0IGl0J3MgYSBvbmUgb2ZmLlxyXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDkwMCksXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBHcmFudCB0aGUgbGFtYmRhIGZ1bmN0aW9uIHRoZSBwZXJtaXNzaW9ucyB0byByZWFkL3dyaXRlIGZyb20gdGhlIFMzIGJ1Y2tldCBhbmQgRHluYW1vREIgdGFibGVcclxuICAgIGJ1Y2tldC5ncmFudFJlYWRXcml0ZShsYW1iZGFGdW5jKTtcclxuICAgIHByb3BzLmRlc3RpbmF0aW9uVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGxhbWJkYUZ1bmMpO1xyXG5cclxuICAgIC8vIEFkZCBub3RpZmljYXRpb24gZm9yIHRoZSBTMyBidWNrZXQgdG8gdHJpZ2dlciB0aGUgbGFtYmRhIGZ1bmN0aW9uXHJcbiAgICBidWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEX1BVVCwgbmV3IExhbWJkYURlc3RpbmF0aW9uKGxhbWJkYUZ1bmMpLCB7IHN1ZmZpeDogJy5jc3YnIH0pO1xyXG4gIH1cclxufSJdfQ==