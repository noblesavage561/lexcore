variable "environment" {}
variable "aws_region" {}

resource "aws_vpc" "lexcore" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "lexcore-vpc-${var.environment}" }
}

output "vpc_id" { value = aws_vpc.lexcore.id }
output "private_subnet_ids" { value = [] }
