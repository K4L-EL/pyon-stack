variable "project"     { type = string, default = "__PYON_NAME__" }
variable "location"    { type = string, default = "westeurope" }
variable "db_admin"    { type = string, default = "pyon" }
variable "db_password" { type = string, sensitive = true }
variable "db_name"     { type = string, default = "__PYON_DB__" }
variable "api_image"   { type = string, default = "ghcr.io/__PYON_GH_OWNER__/__PYON_NAME__-api:latest" }
variable "jwt_secret"  { type = string, sensitive = true }
