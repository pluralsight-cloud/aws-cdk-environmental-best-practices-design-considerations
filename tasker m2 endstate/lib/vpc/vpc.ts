import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface VpcStackProps extends cdk.StackProps {
  stageName: string;
  maxAzs: number;
}

export class VpcStack extends cdk.Stack {

  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    const { stageName, maxAzs } = props;

    // VPC with private subnet
    this.vpc = new ec2.Vpc(this, `TaskerVPC-${stageName}`, {
      vpcName: `TaskerVPC-${stageName}`,
      maxAzs: maxAzs,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: `PublicSubnet-${stageName}`,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          name: `PrivateSubnet-${stageName}`,
        },
      ],
      natGateways: 1,
    });

  }
}