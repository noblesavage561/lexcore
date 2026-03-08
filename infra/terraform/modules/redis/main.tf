variable "environment" {}
variable "vpc_id" {}
variable "subnet_ids" { type = list(string) }

resource "aws_elasticache_subnet_group" "lexcore" {
  name       = "lexcore-redis-${var.environment}"
  subnet_ids = var.subnet_ids
}

resource "aws_security_group" "redis" {
  name   = "lexcore-redis-${var.environment}"
  vpc_id = var.vpc_id
  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elasticache_cluster" "lexcore" {
  cluster_id           = "lexcore-${var.environment}"
  engine               = "redis"
  node_type            = var.environment == "prod" ? "cache.t3.medium" : "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.lexcore.name
  security_group_ids   = [aws_security_group.redis.id]
  tags = { Name = "lexcore-redis-${var.environment}" }
}

output "endpoint" { value = aws_elasticache_cluster.lexcore.cache_nodes[0].address }
output "port" { value = aws_elasticache_cluster.lexcore.cache_nodes[0].port }
