import { Vpc } from "aws-cdk-lib/aws-ec2";
import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvironmentProps } from "./types";
import { Table } from "aws-cdk-lib/aws-dynamodb";
interface PlayerServiceAPIStackProps extends NestedStackProps, EnvironmentProps {
    vpc: Vpc;
    databaseTable: Table;
}
export declare class PlayerServiceAPIStack extends NestedStack {
    constructor(scope: Construct, id: string, props: PlayerServiceAPIStackProps);
}
export {};
