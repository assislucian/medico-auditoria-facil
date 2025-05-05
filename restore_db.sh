#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: ./restore_db.sh <caminho_para_backup>"
  exit 1
fi
cp "$1" src/medicos.db
echo "Banco restaurado a partir de $1" 