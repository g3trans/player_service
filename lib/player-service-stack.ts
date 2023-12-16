import {CfnElement, Stack} from 'aws-cdk-lib';
import {Construct} from "constructs";
import {StackProps} from "aws-cdk-lib/core/lib/stack";
import {IpAddresses, Vpc} from "aws-cdk-lib/aws-ec2";
import {PlayerServiceAPIStack} from "./player-service-api-stack";
import {EnvironmentProps} from "./types";
import {PlayerDatabaseStack} from "./player-database-stack";
import {PlayerDatabaseBackfillStack} from "./player-database-backfill-stack";


interface PlayerServiceStackProps extends StackProps, EnvironmentProps {

}

export class PlayerServiceStack extends Stack {

  private readonly playerDatabaseStack: PlayerDatabaseStack
  private readonly playerDatabaseBackfillStack: PlayerDatabaseBackfillStack

  constructor(scope: Construct, id: string, props: PlayerServiceStackProps) {
    super(scope, id, props);

    const stackName = 'PlayerService';

    const vpc = new Vpc(this, stackName + 'Vpc', {
      ipAddresses: IpAddresses.cidr('10.0.0.0/20'),
      maxAzs: 1,
    });

    this.playerDatabaseStack = new PlayerDatabaseStack(this, stackName + 'Database', {
      environment: props.environment,
      vpc: vpc,
    });

    this.playerDatabaseBackfillStack = new PlayerDatabaseBackfillStack(this, stackName + 'BackfillDatabase', {
      environment: props.environment,
      vpc: vpc,
      destinationTable: this.playerDatabaseStack.table
    });
    this.playerDatabaseBackfillStack.addDependency(this.playerDatabaseStack);

    new PlayerServiceAPIStack(this, stackName + 'API', {
      environment: props.environment,
      databaseTable: this.playerDatabaseStack.table,
      vpc: vpc
    });
    this.playerDatabaseBackfillStack.addDependency(this.playerDatabaseStack);
  }

  getLogicalId(element: CfnElement): string {
    if (element.node.id.includes('NestedStackResource')) {
      return /([a-zA-Z0-9]+)\.NestedStackResource/.exec(element.node.id)![1]
    }
    return super.getLogicalId(element)
  }
}