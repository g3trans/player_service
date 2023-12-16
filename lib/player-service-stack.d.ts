import { CfnElement, Stack } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { StackProps } from "aws-cdk-lib/core/lib/stack";
import { EnvironmentProps } from "./types";
interface PlayerServiceStackProps extends StackProps, EnvironmentProps {
}
export declare class PlayerServiceStack extends Stack {
    private readonly playerDatabaseStack;
    private readonly playerDatabaseBackfillStack;
    constructor(scope: Construct, id: string, props: PlayerServiceStackProps);
    getLogicalId(element: CfnElement): string;
}
export {};
