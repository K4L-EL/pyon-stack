terraform {
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

variable "name"                { type = string }
variable "location"            { type = string, default = "westeurope" }
variable "resource_group_name" { type = string }
variable "sku_tier"            { type = string, default = "Free" }
variable "sku_size"            { type = string, default = "Free" }

resource "azurerm_static_web_app" "this" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku_tier            = var.sku_tier
  sku_size            = var.sku_size
}

output "default_host_name" { value = azurerm_static_web_app.this.default_host_name }
output "api_key"           { value = azurerm_static_web_app.this.api_key, sensitive = true }
