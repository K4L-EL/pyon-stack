# Infrastructure (Terraform)

Azure-flavored stubs. Adapt `modules/` for your cloud.

```
terraform -chdir=environments/dev init
terraform -chdir=environments/dev plan
terraform -chdir=environments/dev apply
```

Remote state is configured per-environment via `backend.tf` (copy from
`backend.tf.example` and fill values).
