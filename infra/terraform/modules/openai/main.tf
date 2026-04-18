terraform {
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

variable "name"                     { type = string }
variable "location"                 { type = string }
variable "resource_group_name"      { type = string }

variable "sku_name"                 { type = string, default = "S0" }
variable "custom_subdomain_name"    { type = string, default = null }
variable "public_network_access_enabled" { type = bool, default = true }

variable "deployment_name"          { type = string, default = "gpt-4o-mini" }
variable "model_name"               { type = string, default = "gpt-4o-mini" }
variable "model_version"            { type = string, default = "2024-07-18" }
variable "deployment_sku_name"      { type = string, default = "GlobalStandard" }
variable "deployment_capacity"      { type = number, default = 20 }

variable "tags" {
  type    = map(string)
  default = {}
}

resource "azurerm_cognitive_account" "this" {
  name                          = var.name
  location                      = var.location
  resource_group_name           = var.resource_group_name
  kind                          = "OpenAI"
  sku_name                      = var.sku_name
  custom_subdomain_name         = coalesce(var.custom_subdomain_name, var.name)
  public_network_access_enabled = var.public_network_access_enabled
  tags                          = var.tags
}

resource "azurerm_cognitive_deployment" "chat" {
  name                 = var.deployment_name
  cognitive_account_id = azurerm_cognitive_account.this.id

  model {
    format  = "OpenAI"
    name    = var.model_name
    version = var.model_version
  }

  sku {
    name     = var.deployment_sku_name
    capacity = var.deployment_capacity
  }
}

output "endpoint"        { value = azurerm_cognitive_account.this.endpoint }
output "primary_key"     { value = azurerm_cognitive_account.this.primary_access_key, sensitive = true }
output "deployment_name" { value = azurerm_cognitive_deployment.chat.name }
output "account_id"      { value = azurerm_cognitive_account.this.id }
