# Troubleshooting

Common issues and solutions for DClaw Backup.

## Quick Diagnostics

```bash
# Check app pods
kubectl get pods -n dclaw-backup

# Check logs
kubectl logs -n dclaw-backup deployment/dclaw-backup-backend

# Check database
kubectl get clusters -n dclaw-backup
```

## Sections

- [Common Issues](./common-issues)
- [FAQ](./faq)
