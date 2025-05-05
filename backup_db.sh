#!/bin/bash
set -e
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
cp src/medicos.db backups/medicos_backup_$DATE.db
echo "Backup realizado em backups/medicos_backup_$DATE.db" 