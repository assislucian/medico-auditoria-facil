# MedCheck

MedCheck é uma plataforma de auditoria médica automatizada que compara demonstrativos TISS e guias de procedimentos com a Tabela CBHPM 2015 para detectar glosas, valores incorretos e pagamentos faltantes.

## Tecnologias

- Backend: FastAPI + PostgreSQL
- Frontend: Next.js + Tailwind CSS + TypeScript
- OCR/PDF: pdfplumber, PyMuPDF, regex
- Tabela de Referência: CBHPM 2015 (XLSX)

## Principais Funcionalidades

- Upload e extração de dados de PDFs (demonstrativos e guias)
- Cruzamento de dados com validação por CRM e papel médico
- Relatórios detalhados e executivos
- Exportação CSV/PDF
- Histórico de auditorias com autenticação JWT

## Como rodar

Instruções completas em breve. Pré-requisitos:
- Python 3.11+
- Node.js 18+
- Docker (opcional para PostgreSQL + backend)

## Diretórios

- `/backend` — API em FastAPI
- `/frontend` — App web em Next.js
