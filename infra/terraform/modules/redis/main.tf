variable "environment" {}
variable "vpc_id" {}
variable "subnet_ids" { type = list(string) }

resource "aws_security_group" "redis" {
  name   = "lexcore-redis-${var.environment}"
  vpc_id = var.vpc_id
  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }
}

output "endpoint" { value = "" }
