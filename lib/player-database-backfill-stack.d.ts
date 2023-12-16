import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { EnvironmentProps } from "./types";
interface PlayerDatabaseBackfillStackProps extends NestedStackProps, EnvironmentProps {
    vpc: Vpc;
    destinationTable: Table;
}
export declare class PlayerDatabaseBackfillStack extends NestedStack {
    constructor(scope: Construct, id: string, props: PlayerDatabaseBackfillStackProps);
}
export {};
