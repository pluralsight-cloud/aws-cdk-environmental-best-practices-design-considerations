import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface DatabaseStackProps extends cdk.StackProps {
  stageName: string;
}

export class DatabaseStack extends cdk.Stack {

  public readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { stageName } = props;

    // DynamoDB table
    // Replicas for prod only
    // Change billing between dev / prod
    this.table = new dynamodb.TableV2(this, `TaskDB-${stageName}`, {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      replicas: [
        { region: 'us-west-2' }
      ],
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

  }
}
