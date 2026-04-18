terraform {
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

variable "name"                { type = string }
variable "location"            { type = string }
variable "resource_group_name" { type = string }
variable "sku_name"            { type = string, default = "B1" }
variable "app_settings"        { type = map(string), default = {} }
variable "docker_image"        { type = string, default = "" }

resource "azurerm_service_plan" "this" {
  name                = "${var.name}-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = var.sku_name
}

resource "azurerm_linux_web_app" "this" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.this.id
  https_only          = true

  site_config {
    application_stack {
      docker_image_name = var.docker_image
    }
    always_on = true
  }

  app_settings = var.app_settings
}

output "default_hostname" { value = azurerm_linux_web_app.this.default_hostname }
output "name"             { value = azurerm_linux_web_app.this.name }
