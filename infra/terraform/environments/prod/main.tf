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
  name     = "${var.project}-prod-rg"
  location = var.location
}

module "postgres" {
  source              = "../../modules/postgres"
  name                = "${var.project}-prod-pg"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  admin_login         = var.db_admin
  admin_password      = var.db_password
  database_name       = var.db_name
  sku_name            = "GP_Standard_D2s_v3"
  storage_mb          = 65536
}

module "api" {
  source              = "../../modules/app-service"
  name                = "${var.project}-prod-api"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  sku_name            = "P1v3"
  docker_image        = var.api_image
  app_settings = {
    "ASPNETCORE_ENVIRONMENT"   = "Production"
    "ConnectionStrings__Default" = "Host=${module.postgres.host};Port=5432;Database=${module.postgres.database_name};Username=${var.db_admin};Password=${var.db_password};Ssl Mode=Require"
    "Jwt__Secret"              = var.jwt_secret
    "Jwt__Issuer"              = var.project
    "Jwt__Audience"            = var.project
  }
}

module "web" {
  source              = "../../modules/static-web-app"
  name                = "${var.project}-prod-web"
  resource_group_name = azurerm_resource_group.this.name
}

module "app" {
  source              = "../../modules/static-web-app"
  name                = "${var.project}-prod-app"
  resource_group_name = azurerm_resource_group.this.name
}

output "api_url" { value = "https://${module.api.default_hostname}" }
output "web_url" { value = "https://${module.web.default_host_name}" }
output "app_url" { value = "https://${module.app.default_host_name}" }
