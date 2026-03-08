variable "environment" {}
variable "vpc_id" {}
variable "subnet_ids" { type = list(string) }
variable "db_password" { sensitive = true }

resource "aws_db_subnet_group" "lexcore" {
  name       = "lexcore-${var.environment}"
  subnet_ids = var.subnet_ids
}

resource "aws_security_group" "rds" {
  name        = "lexcore-rds-${var.environment}"
  vpc_id      = var.vpc_id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }
}

resource "aws_db_instance" "lexcore" {
  identifier             = "lexcore-${var.environment}"
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = var.environment == "prod" ? "db.t3.medium" : "db.t3.micro"
  allocated_storage      = 20
  max_allocated_storage  = 100
  db_name                = "lexcore"
  username               = "lexcore"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.lexcore.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = var.environment != "prod"
  deletion_protection    = var.environment == "prod"
  storage_encrypted      = true
  backup_retention_period = var.environment == "prod" ? 7 : 1

  tags = { Name = "lexcore-postgres-${var.environment}" }
}

output "endpoint" { value = aws_db_instance.lexcore.endpoint }
