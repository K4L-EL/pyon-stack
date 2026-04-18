terraform {
  required_version = ">= 1.6"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "this" {
  name     = "${var.project}-dev-rg"
  location = var.location
}

module "postgres" {
  source              = "../../modules/postgres"
  name                = "${var.project}-dev-pg"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  admin_login         = var.db_admin
  admin_password      = var.db_password
  database_name       = var.db_name
}

module "api" {
  source              = "../../modules/app-service"
  name                = "${var.project}-dev-api"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  docker_image        = var.api_image
  app_settings = {
    "ASPNETCORE_ENVIRONMENT"   = "Development"
    "ConnectionStrings__Default" = "Host=${module.postgres.host};Port=5432;Database=${module.postgres.database_name};Username=${var.db_admin};Password=${var.db_password};Ssl Mode=Require"
    "Jwt__Secret"              = var.jwt_secret
    "Jwt__Issuer"              = var.project
    "Jwt__Audience"            = var.project
  }
}

module "web" {
  source              = "../../modules/static-web-app"
  name                = "${var.project}-dev-web"
  resource_group_name = azurerm_resource_group.this.name
}

module "app" {
  source              = "../../modules/static-web-app"
  name                = "${var.project}-dev-app"
  resource_group_name = azurerm_resource_group.this.name
}

output "api_url" { value = "https://${module.api.default_hostname}" }
output "web_url" { value = "https://${module.web.default_host_name}" }
output "app_url" { value = "https://${module.app.default_host_name}" }
