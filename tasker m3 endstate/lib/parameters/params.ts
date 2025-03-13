import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class ParameterStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ssm.StringParameter(this, 'DevMaxAzs', {
      parameterName: '/config/dev/vpc/maxAzs',
      stringValue: '2',
    });

    new ssm.StringParameter(this, 'ProdMaxAzs', {
      parameterName: '/config/prod/vpc/maxAzs',
      stringValue: '3',
    });
  }
}