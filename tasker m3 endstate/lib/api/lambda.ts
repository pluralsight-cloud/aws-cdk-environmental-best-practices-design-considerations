import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface LambdaFunctionProps {
  stageName: string;
  table: dynamodb.TableV2;
  vpc: ec2.IVpc; // Update to use VPC object
}

export class LambdaFunction extends Construct {

  public readonly addTaskFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaFunctionProps) {
    super(scope, id);

    const { stageName, table, vpc } = props;

    // Task adder Lambda function
    this.addTaskFunction = new lambda.Function(this, `TaskerAdd-${stageName}`, {
      functionName: `TaskerAdd-${stageName}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      environment: {
        TABLE_NAME: table.tableName,
      }
    });

    // Permissions
    table.grantReadWriteData(this.addTaskFunction);

  }
}
