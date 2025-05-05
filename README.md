# VacayTracker

A modern, collaborative vacation expense tracking application built with React. Perfect for group trips where you need to manage shared expenses, split costs, and track who owes what.

## 🌟 Features

### Core Expense Tracking
- Track vacation expenses with categories (accommodation, food, activities, etc.)
- Set budgets for different expense categories
- Visual charts showing spending distribution (pie, bar, and line charts)
- Multiple currency support (USD, EUR, GBP, JPY, CAD)
- Dark/Light mode support

### Trip Management
- Create and manage multiple trips
- Open/Close trips to control expense tracking
- Track trip duration and destination
- Email notifications for budget warnings

### Collaborative Features
- **Trip Sharing**: Invite other users to trips via email
- **Expense Splitting**: Split expenses equally or with custom amounts
- **Group Expense Tracking**: Track who paid what and who owes whom
- **Comments & Notes**: Add comments to expenses for better context
- **Real-time Balance Tracking**: See current balances for each trip member

### Data Export
- Export trips to PDF, CSV, or JSON formats
- Include budget information, charts, and category breakdowns
- Customizable export filters by date range and categories
- Share reports directly from the app

### Money-Saving Features
- Personalized travel tips based on spending patterns
- Budget warnings and notifications
- Category-specific money-saving recommendations

## 🚀 Getting Started

### Prerequisites
- Node.js 14.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/914RobbLeusteanVacayExpenseTracker.git
cd VacayExpenseTracker 
```
2.Install dependencies:
```bash
npm install
```
3.Start the development server:
```bash
npm start
```
4.Open http://localhost:3000 to view it in the browser.

## 📁 Project Structure
- src/
- ├── components/           # React components
- │   ├── AccountSettings/  # User account settings
- │   ├── Budget/          # Budget management
- │   ├── Collaboration/   # Trip sharing & expense splitting
- │   ├── Dashboard/       # Main dashboard
- │   ├── Expenses/        # Expense tracking
- │   ├── Export/          # Data export functionality
- │   ├── Shared/          # Reusable components
- │   ├── Tips/            # Travel tips
- │   └── Trips/           # Trip management
- ├── contexts/            # React Context for state management
- ├── hooks/               # Custom React hooks
- ├── utils/               # Utility functions
- └── data/                # Default data and constants

## 🔧 Technology Stack

- **React**t - UI library
- **React Hooks** - State management
- **Context API** - Global state management
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **FileSaver.js** - File downloads

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop computers**
- **Tablets**
- **Mobile devices (iOS and Android)**



