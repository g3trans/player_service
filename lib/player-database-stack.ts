import {NestedStack, NestedStackProps, RemovalPolicy, Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Vpc} from 'aws-cdk-lib/aws-ec2';
import {AttributeType, Table} from 'aws-cdk-lib/aws-dynamodb';
import {EnvironmentProps} from "./types";

interface PlayerDatabaseStackProps extends NestedStackProps, EnvironmentProps {
    vpc: Vpc;
}

export class PlayerDatabaseStack extends NestedStack {

    public readonly table: Table;

    constructor(scope: Construct, id: string, props: PlayerDatabaseStackProps) {
        super(scope, id, props);

        this.table = new Table(this, 'PlayersDatabase', {
            partitionKey: { name: 'playerID', type: AttributeType.STRING },
            // Sort key by birth year since it's likely we'll want to look up players
            // all players born in a certain year
            sortKey: { name: 'nameLast', type: AttributeType.STRING },
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}