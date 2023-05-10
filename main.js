const AWS = require('aws-sdk');
const util = require('util');

(async () => {
  var accessKeyId = '';
  var secretAccessKey = '';
  var region = 'ap-southeast-1';
  AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
      accessKeyId = AWS.config.credentials.accessKeyId;
      secretAccessKey = AWS.config.credentials.secretAccessKey;
    }
  });

  console.log('Access Key ID: ', accessKeyId);
  console.log('Secret Access Key:', secretAccessKey);
  console.log('Region: ', region); 

  const tagKey = 'LKS-ID';
  const tagValueSuffix = 'MODUL3';
  const ddbTableName = 'lksccjabar2023-dynamodb';
  const ddbBilling = 'PAY_PER_REQUEST';
  const ddbTableClass = 'STANDARD';
  const rdsCluster = 'lksccjabar2023-rds';
  const rdsEngine = 'aurora-postgresql';
  const elbName = 'lksccjabar2023-elb';
  const elbScheme = 'internet-facing';
  const line = '===============================================';

  var score = 0;
  var ec2 = new AWS.EC2({region: region});
  var efs = new AWS.EFS({region: region});
  var dynamoDb = new AWS.DynamoDB({region: region});
  var rds = new AWS.RDS({region: region});
  var elbv2 = new AWS.ELBv2({region: region});

  // VPC
  var vpc = await ec2.describeVpcs({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-VPC`
        ]
      }
    ]
  }).promise();

  console.log(line);
  try {
    if (vpc) {
      console.log(util.inspect(vpc, false, null, true));
      let cidr = vpc.Vpcs[0].CidrBlock;

      if (cidr && cidr == '10.0.0.0/16') {
        console.log(cidr);
        console.log('VPC Score: 1');
        score = score + 3;
      } else {
        console.log('VPC Score: 1');
        score = score + 1;
      }
    } else {
      console.log('VPC Score: 0');
    }
  } catch (err) {
    console.error('vpc error', err);
  }
  console.log(line);
  console.log();


  // SUBNETS
  var globalVpcId = vpc.Vpcs[0].VpcId;
  console.log('VPC ID: ', globalVpcId);
  var publicSubnetA = await ec2.describeSubnets({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-PUBLIC-SUBNET-A`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (publicSubnetA) {
      console.log(util.inspect(publicSubnetA, false, null, true));

      let cidr = publicSubnetA.Subnets[0].CidrBlock;
      let vpcId = publicSubnetA.Subnets[0].VpcId;
      console.log(cidr);

      if (cidr && cidr == '10.0.0.0/24' && vpcId == globalVpcId) {
        console.log('Public Subnet A Score: 3');
        score = score + 3
      } else {
        console.log('Public Subnet A Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Public Subnet A Score: 0');
    }
  } catch (err) {
    console.error('publicSubnetA error:', err);
  }
  console.log(line);
  console.log();

  var publicSubnetB = await ec2.describeSubnets({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-PUBLIC-SUBNET-B`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (publicSubnetB) {
      console.log(util.inspect(publicSubnetB, false, null, true));

      let cidr = publicSubnetB.Subnets[0].CidrBlock;
      let vpcId = publicSubnetB.Subnets[0].VpcId;
      console.log(cidr);

      if (cidr && cidr == '10.0.1.0/24' && vpcId == globalVpcId) {
        console.log('Public Subnet B Score: 3');
        score = score + 3
      } else {
        console.log('Public Subnet B Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Public Subnet B Score: 0');
    }
  } catch (err) {
    console.error('publicSubnetB error:', err);
  }
  console.log(line);
  console.log();

  var privateSubnetA = await ec2.describeSubnets({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-PRIVATE-SUBNET-A`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (privateSubnetA) {
      console.log(util.inspect(privateSubnetA, false, null, true));

      let cidr = privateSubnetA.Subnets[0].CidrBlock;
      let vpcId = privateSubnetA.Subnets[0].VpcId;
      console.log(cidr);

      if (cidr && cidr == '10.0.2.0/24' && vpcId == globalVpcId) {
        console.log('Private Subnet A Score: 3');
        score = score + 3
      } else {
        console.log('Private Subnet A Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Private Subnet A Score: 0');
    }
  } catch (err) {
    console.error('privateSubnetA error:', err);
  }
  console.log(line);
  console.log();

  var privateSubnetB = await ec2.describeSubnets({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-PRIVATE-SUBNET-B`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (privateSubnetB) {
      console.log(util.inspect(privateSubnetB, false, null, true));

      let cidr = privateSubnetB.Subnets[0].CidrBlock;
      let vpcId = privateSubnetB.Subnets[0].VpcId; 
      console.log(cidr);

      if (cidr && cidr == '10.0.3.0/24' && vpcId == globalVpcId) {
        console.log('Private Subnet B Score: 3');
        score = score + 3
      } else {
        console.log('Private Subnet B Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Private Subnet B Score: 0');
    }
  } catch (err) {
    console.error('privateSubnetB error:', err);
  }
  console.log(line);
  console.log();

  // IGW
  var igw = await ec2.describeInternetGateways({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-IGW`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (igw) {
      console.log(util.inspect(igw, false, null, true))
      let vpcId = igw.InternetGateways[0].Attachments[0].VpcId;
      if (vpcId && vpcId == globalVpcId) {
        console.log('IGW Score: 3');
        score = score + 3;
      } else {
        console.log('IGW Score: 1');
        score = score + 1;
      }
    } else {
      console.log('IGW Score: 0');
    }
  } catch (err) {
    console.error('igw error', err);
  }
  console.log(line);
  console.log();

  // NAT GW
  var nat = await ec2.describeNatGateways({
    Filter: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-NAT`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (nat) {
      console.log(util.inspect(nat, false, null, true));
      let vpcId = nat.NatGateways[0].VpcId;
      if (vpcId && vpcId == globalVpcId) {
        console.log('NAT Score: 3');
        score = score + 3;
      } else {
        console.log('NAT Score: 1');
        score = score + 1;
      }
    } else {
      console.log('NAT Score: 0')
    }
  } catch (err) {
    console.error('nat error', err);
  }
  console.log(line);
  console.log();

  // PUBLIC ROUTE TABLE
  var publicRouteTable = await ec2.describeRouteTables({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-PUBLIC-ROUTE`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (publicRouteTable) {
      console.log(util.inspect(publicRouteTable, false, null, true));
      let vpcId = publicRouteTable.RouteTables[0].VpcId

      if (vpcId && vpcId == globalVpcId) {
        console.log('Public Route Table Score: 3');
        score = score + 3;
      } else {
        console.log('Public Route Table Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Public Route Table Score: 0');
    }
  } catch (err) {
    console.error('publicRouteTable error', err);
  }
  console.log(line);
  console.log();

  // PRIVATE ROUTE TABLE
  var privateRouteTable = await ec2.describeRouteTables({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-PRIVATE-ROUTE`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (privateRouteTable) {
      console.log(util.inspect(privateRouteTable, false, null, true));
      let vpcId = privateRouteTable.RouteTables[0].VpcId

      if (vpcId && vpcId == globalVpcId) {
        console.log('Private Route Table Score: 3');
        score = score + 3;
      } else {
        console.log('Private Route Table Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Private Route Table Score: 0');
    }
  } catch (err) {
    console.error('privateRouteTable error', err);
  }
  console.log(line);
  console.log();

  // SECURITY GROUPS
  var webSecurityGroup = await ec2.describeSecurityGroups({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-SG-WEB`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (webSecurityGroup) {
      console.log(util.inspect(webSecurityGroup, false, null, true));
      let vpcId = webSecurityGroup.SecurityGroups[0].VpcId;
      if (vpcId && vpcId == globalVpcId) {
        console.log('Web Security Group Score: 3');
        score = score + 3;
      } else {
        console.log('Web Security Group Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Web Security Group Score: 0');
    }
  } catch (err) {
    console.error('webSecurityGroup error', err);
  }
  console.log(line);
  console.log();

  var bastionSecurityGroup = await ec2.describeSecurityGroups({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-SG-BASTION`
        ]
      }
    ]
  }).promise();
  console.log(line);
  try {
    if (bastionSecurityGroup) {
      console.log(util.inspect(bastionSecurityGroup, false, null, true));
      let vpcId = bastionSecurityGroup.SecurityGroups[0].VpcId;
      if (vpcId && vpcId == globalVpcId) {
        console.log('Bastion Security Group Score: 3');
        score = score + 3;
      } else {
        console.log('Bastion Security Group Score: 1');
        score = score + 1;
      }
    } else {
      console.log('Bastion Security Group Score: 0');
    }
  } catch (err) {
    console.error('bastionSecurityGroup error', err);
  }
  console.log(line);
  console.log();

  // EFS 
  var efsStorage = await efs.describeFileSystems({}).promise();
  console.log(line)
  try {
    if (efsStorage) {
      console.log(util.inspect(efsStorage, false, null, true));
      efsStorage.FileSystems.map(function (tags) {
        tags.Tags.map(function (val) {
          if (val.Key == `${tagKey}` && val.Value == `${tagValueSuffix}-EFS`) {
            console.log('EFS Score: 3');
            score = score + 3;
          }
        });
      });
    } else {
      console.log('EFS Score: 0');
    }
  } catch (err) {
    console.error('efsStorage error', err);
  }
  console.log(line)
  console.log()

  // DynamoDB
  var ddb = await dynamoDb.listTables({}).promise(); 
  console.log(line)
  try {
    if (ddb) {
      console.log(util.inspect(ddb, false, null, true));
      let exceptedTable = ddb.TableNames.filter(function (el) {
        return el === ddbTableName;
      });
      if (exceptedTable.length === 1) {
        let describeDdb = await dynamoDb.describeTable({
          TableName: exceptedTable[0]
        }).promise();

        let billing = describeDdb.Table.BillingModeSummary.BillingMode;
        let tableClass = describeDdb.Table.TableClassSummary.TableClass;
        if (billing == ddbBilling && tableClass == ddbTableClass) {
          console.log('DynamoDB Score: 3');
          score = score + 3;
        } else {
          console.log('DynamoDB Score: 1');
          score = score + 1;
        }
      }
    }
  } catch (err) {
    console.error('ddb error', err);
  }
  console.log(line)
  console.log()

  // RDS
  var auroraRds = await rds.describeDBClusters({
    Filters: [
      {
        Name: 'db-cluster-id',
        Values: [
          rdsCluster
        ]
      }
    ]
  }).promise();
  console.log(line)
  try {
    console.log(util.inspect(auroraRds.DBClusters, false, null, true))
    if (auroraRds) {
      if (auroraRds.DBClusters[0].ServerlessV2ScalingConfiguration) {
        if (auroraRds.DBClusters[0].Engine == rdsEngine) {
          console.log('Amazon RDS Aurora Serverless Score: 3');
          score = score + 3;
        } else {
          console.log('Amazon RDS Aurora Serverless Score: 1');
          score = score + 1;
        }
      }
    }
  } catch (err) {
    console.error('auroraRds error', err);
  }
  console.log(line)
  console.log()

  // EC2 Launch Templates
  var ec2launchTemplates = await ec2.describeLaunchTemplates({
    Filters: [
      {
        Name: `tag:${tagKey}`,
        Values: [
          `${tagValueSuffix}-EC2-LAUNCH-TEMPLATE`
        ]
      }
    ]
  }).promise();
  console.log(line)
  try {
    if (ec2launchTemplates) {
      console.log(util.inspect(ec2launchTemplates, false, null, true));
      console.log('EC2 Launch Templates Score: 3');
      score = score + 2;
    }
  } catch (err) {
    console.error('ec2launchTemplates error:', err);
  }
  console.log(line)
  console.log()
  
  // Elastic Load Balancer
  var lb = await elbv2.describeLoadBalancers({
    Names: [elbName]
  }).promise()
  console.log(line)
  try {
    if (lb) {
      console.log(util.inspect(lb, false, null, true))
      let vpcId = lb.LoadBalancers[0].VpcId;
      let scheme = lb.LoadBalancers[0].Scheme;
      let az = lb.LoadBalancers[0].AvailabilityZones;
      if (vpcId == globalVpcId && scheme == elbScheme && az.length == 2) {
        console.log('ELB Score: 3');
        score = score + 3;
      } else {
        console.log('ELB Score: 1');
        score = score + 1;
      }
    }
  } catch (err) {
    console.error('lb error', err)
  }
  console.log(line)
  console.log()

  console.log(line);
  console.log('Total Score:', parseFloat(score / 2));
  console.log(line);
})();
