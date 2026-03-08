terraform {
  required_version = ">= 1.9.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure per environment:
    # bucket = "lexcore-terraform-state"
    # key    = "prod/terraform.tfstate"
    # region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "LexCore"
      ManagedBy   = "Terraform"
      Environment = var.environment
      Owner       = "BBAServices"
    }
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

module "vpc" {
  source = "./modules/vpc"
  environment = var.environment
  aws_region  = var.aws_region
}

module "rds" {
  source       = "./modules/rds"
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.private_subnet_ids
  db_password  = var.db_password
}

module "redis" {
  source     = "./modules/redis"
  environment = var.environment
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}
