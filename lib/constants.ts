import {Vpc} from "aws-cdk-lib/aws-ec2";

export enum EnvironmentType {
    Development = 'devo',
    Production = 'prod',
}
