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
  const line = '===============================================';

  var score = 0;
  var ec2 = new AWS.EC2({region: region});

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
        console.log('VPC Score: 3');
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

  console.log(line);
  console.log('Total Score:', score);
  console.log(line);
})();
