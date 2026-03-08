variable "environment" {}
variable "aws_region" {}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "lexcore" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "lexcore-vpc-${var.environment}" }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.lexcore.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = { Name = "lexcore-private-${count.index + 1}-${var.environment}" }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.lexcore.id
  cidr_block              = "10.0.${count.index + 101}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "lexcore-public-${count.index + 1}-${var.environment}" }
}

resource "aws_internet_gateway" "lexcore" {
  vpc_id = aws_vpc.lexcore.id
  tags   = { Name = "lexcore-igw-${var.environment}" }
}

output "vpc_id" { value = aws_vpc.lexcore.id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
