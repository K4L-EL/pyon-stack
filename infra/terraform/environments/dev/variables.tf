variable "project"     { type = string, default = "__PYON_NAME__" }
variable "location"    { type = string, default = "westeurope" }
variable "db_admin"    { type = string, default = "pyon" }
variable "db_password" { type = string, sensitive = true }
variable "db_name"     { type = string, default = "__PYON_DB__" }
variable "api_image"   { type = string, default = "ghcr.io/__PYON_GH_OWNER__/__PYON_NAME__-api:latest" }
variable "jwt_secret"  { type = string, sensitive = true }

variable "enable_openai"      { type = bool,   default = false }
variable "openai_location"    { type = string, default = "eastus" }
variable "openai_deployment"  { type = string, default = "gpt-4o-mini" }
variable "openai_model"       { type = string, default = "gpt-4o-mini" }
variable "openai_model_version" { type = string, default = "2024-07-18" }
variable "openai_capacity"    { type = number, default = 20 }
