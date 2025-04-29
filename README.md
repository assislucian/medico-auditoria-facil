
# MedCheck - Frontend

![MedCheck Logo](public/logo.png)

MedCheck is a comprehensive web application designed to help medical professionals audit and analyze their payment statements from healthcare providers, ensuring they receive proper compensation for their services.

## 🌟 Features

- **Payment Analysis**: Compare payments received against expected values based on CBHPM standards
- **Document Uploads**: Upload medical invoices and payment statements for automated analysis
- **Visual Dashboard**: Comprehensive dashboard with payment statistics and trends
- **Payment Recovery**: Tools to identify and recover underpayments 
- **Historical Tracking**: View past analyses and track payment trends over time

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/your-username/medcheck-frontend.git
cd medcheck-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📋 Project Structure

```
medcheck-frontend/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # React components
│   ├── contexts/       # React contexts for global state
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Mock integration layer (for frontend-only version)
│   ├── pages/          # Page components
│   ├── services/       # Service functions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .gitignore
├── index.html
├── package.json
├── README.md
└── tsconfig.json
```

## 💻 Technologies Used

- **React**: UI library 
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library
- **Vite**: Build tool and development server
- **Lucide**: Icon library
- **Recharts**: Charting library

## 📱 Pages & Navigation

- **Landing Page**: Overview of the application and its features
- **Dashboard**: Main user interface after login
- **Analysis**: Detailed view of payment analyses
- **Upload**: Upload and process medical documents
- **Reports**: Generate and view reports
- **Settings**: User preferences and reference table settings
- **Profile**: User profile information
- **Help**: Documentation and support resources

## 🎨 UI Components

The application includes numerous reusable components:

- Form inputs and validation
- Data tables and filters
- Charts and visualizations
- Modals and dialogs
- Navigation elements
- Status indicators

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).
