import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { EnvironmentProps } from "./types";
interface PlayerDatabaseStackProps extends NestedStackProps, EnvironmentProps {
    vpc: Vpc;
}
export declare class PlayerDatabaseStack extends NestedStack {
    readonly table: Table;
    constructor(scope: Construct, id: string, props: PlayerDatabaseStackProps);
}
export {};
