import {Duration, NestedStack, NestedStackProps, RemovalPolicy} from 'aws-cdk-lib';
import {Bucket, EventType} from 'aws-cdk-lib/aws-s3';
import {Construct} from "constructs";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {LambdaDestination} from "aws-cdk-lib/aws-s3-notifications";
import {EnvironmentProps} from "./types";

interface PlayerDatabaseBackfillStackProps extends NestedStackProps, EnvironmentProps {
  vpc: Vpc;
  destinationTable: Table;
}

export class PlayerDatabaseBackfillStack extends NestedStack {
  constructor(scope: Construct, id: string, props: PlayerDatabaseBackfillStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'PlayerDBBackfillBucket', {
      removalPolicy: RemovalPolicy.DESTROY
    });
    const lambdaFunc = new Function(this, 'PlayerDBBackfillHandler', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset('lambda'),
      handler: 'backfill-players-lambda.handler',
      environment: {
        DESTINATION_TABLE_NAME: props.destinationTable.tableName,
        ORIGIN_BUCKET_NAME: bucket.bucketName
      },
      // Backfill takes 150~ entries 8 seconds => 15k 800~ seconds
      // Csv is 20k, will backfill 10k at a time.
      // Can implement batching to improve performance but it's a one off.
      timeout: Duration.seconds(900),
    });

    // Grant the lambda function the permissions to read/write from the S3 bucket and DynamoDB table
    bucket.grantReadWrite(lambdaFunc);
    props.destinationTable.grantReadWriteData(lambdaFunc);

    // Add notification for the S3 bucket to trigger the lambda function
    bucket.addEventNotification(EventType.OBJECT_CREATED_PUT, new LambdaDestination(lambdaFunc), { suffix: '.csv' });
  }
}