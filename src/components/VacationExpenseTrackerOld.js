import React from 'react';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, DollarSign, Settings, Plus, Download, Share2, X, FileText, Filter, Map, MapPin, Lock, Unlock } from 'lucide-react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AccountSettings from './AccountSettings';

// App constants
const CONSTANTS = {
  BUDGET_WARNING_THRESHOLD: 80, // percentage of budget that triggers warning
  BUDGET_DANGER_THRESHOLD: 100, // percentage of budget that triggers danger
  NOTIFICATION_TIMEOUT: 3000, // milliseconds for notifications to disappear
  CHART_OUTER_RADIUS: 80,
  CHART_MARGINS: { top: 5, right: 30, left: 20, bottom: 5 },
  DEFAULT_CURRENCY: 'USD',
};

// Color palette
const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280',
  success: '#22c55e',
  categories: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9']
};

// Default expense categories
const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'accommodation', name: 'Accommodation', color: COLORS.categories[0] },
  { id: 'food', name: 'Food & Drinks', color: COLORS.categories[1] },
  { id: 'activities', name: 'Activities', color: COLORS.categories[2] },
  { id: 'transportation', name: 'Transportation', color: COLORS.categories[3] },
  { id: 'shopping', name: 'Shopping', color: COLORS.categories[4] },
  { id: 'other', name: 'Other', color: COLORS.categories[5] }
];

// Default budget template
const DEFAULT_BUDGET_TEMPLATE = {
  accommodation: 0,
  food: 0,
  activities: 0,
  transportation: 0,
  shopping: 0,
  other: 0
};

// Tips by category
const MONEY_SAVING_TIPS = {
  accommodation: [
    "Consider booking hostels or homestays instead of hotels",
    "Try house-sitting or home exchange programs",
    "Book accommodations with kitchen access to save on meals"
  ],
  food: [
    "Eat where locals eat - usually cheaper and more authentic",
    "Visit local markets and prepare some meals yourself",
    "Look for lunch specials rather than dining out for dinner",
    "Look for tips reccomended on Reddit and Tiktok"
  ],
  activities: [
    "Look for free walking tours or city attractions",
    "Check for museum free days or discounted hours",
    "Research city passes that bundle attractions at a discount"
  ],
  transportation: [
    "Use public transportation instead of taxis",
    "Consider weekly transit passes if staying longer",
    "Walk or rent bikes for short distances"
  ],
  shopping: [
    "Set a specific souvenir budget before your trip",
    "Look for local markets rather than tourist shops",
    "Consider practical souvenirs you'll actually use"
  ],
  other: [
    "Use free WiFi instead of expensive data plans",
    "Bring basic medications from home",
    "Check if your hotel offers free laundry facilities"
  ]
};

// Currency symbol mapping
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$'
};

// Main Component
const VacationExpenseTracker = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(DEFAULT_BUDGET_TEMPLATE);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  const [notification, setNotification] = useState(null);
  const [editingBudget, setEditingBudget] = useState(false);
  const [chartType, setChartType] = useState('pie');
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [currency, setCurrency] = useState(CONSTANTS.DEFAULT_CURRENCY);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to VacayTracker! Create a trip to start logging expenses.", read: false, date: "Apr 23" }
  ]);
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);
  const [editingExpense, setEditingExpense] = useState(null);

  // New state for trip management
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Export-related state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf',
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    categories: DEFAULT_EXPENSE_CATEGORIES.map(cat => cat.id),
    pdfOptions: {
      includeBudget: true,
      includeCharts: true,
      includeCategoryBreakdown: true
    },
    filename: `VacayTracker_${new Date().toISOString().slice(0, 7)}`
  });

  // Load expenses when active trip changes
  useEffect(() => {
    if (activeTrip) {
      const tripExpenses = activeTrip.expenses || [];
      setExpenses(tripExpenses);
      if (activeTrip.budget) {
        setBudget(activeTrip.budget);
      } else {
        setBudget(DEFAULT_BUDGET_TEMPLATE);
      }
    } else {
      setExpenses([]);
      setBudget(DEFAULT_BUDGET_TEMPLATE);
    }
  }, [activeTrip]);

  // Load trips from localStorage
  useEffect(() => {
    const savedTrips = localStorage.getItem('vacayTrackerTrips');
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips);
      setTrips(parsedTrips);

      // Set active trip to the most recent open trip
      const openTrip = parsedTrips.find(trip => trip.status === 'open');
      if (openTrip) {
        setActiveTrip(openTrip);
      }
    }
  }, []);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('vacayTrackerTrips', JSON.stringify(trips));
    }
  }, [trips]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettings || showNotifications) {
        // Check if the click is outside both dropdowns
        if (!event.target.closest('.settings-dropdown') && !event.target.closest('.notifications-dropdown')) {
          setShowSettings(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings, showNotifications]);

  // Get currency symbol
  const getCurrencySymbol = () => {
    return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS[CONSTANTS.DEFAULT_CURRENCY];
  };

  // Handle creating a new trip
  const handleCreateTrip = () => {
    if (!newTrip.name || !newTrip.destination) {
      setNotification({
        type: 'error',
        message: 'Please enter both trip name and destination'
      });
      return;
    }

    const trip = {
      id: `trip-${Date.now()}`,
      name: newTrip.name,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      status: 'open',
      expenses: [],
      budget: { ...DEFAULT_BUDGET_TEMPLATE },
      createdAt: new Date().toISOString()
    };

    setTrips([...trips, trip]);
    setActiveTrip(trip);
    setShowNewTripForm(false);
    setNewTrip({
      name: '',
      destination: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });

    setNotification({
      type: 'success',
      message: `Trip "${trip.name}" created successfully!`
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  // Handle closing a trip
  const handleCloseTrip = (tripId) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, status: 'closed' };
      }
      return trip;
    });

    setTrips(updatedTrips);

    if (activeTrip && activeTrip.id === tripId) {
      // Find another open trip if available
      const openTrip = updatedTrips.find(trip => trip.status === 'open');
      setActiveTrip(openTrip || null);
    }

    setNotification({
      type: 'info',
      message: 'Trip closed successfully'
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  // Handle reopening a trip
  const handleReopenTrip = (tripId) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, status: 'open' };
      }
      return trip;
    });

    setTrips(updatedTrips);

    setNotification({
      type: 'success',
      message: 'Trip reopened successfully'
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  // Calculate methods that now work with active trip
  const calculateCategoryTotal = (category) => {
    if (!activeTrip) return 0;
    return activeTrip.expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getCategoryName = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getCategoryColor = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.color : COLORS.neutral;
  };

  const getTotalExpenses = () => {
    if (!activeTrip) return 0;
    return activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalBudget = () => {
    if (!activeTrip) return 0;
    return Object.values(activeTrip.budget || DEFAULT_BUDGET_TEMPLATE).reduce((sum, value) => sum + value, 0);
  };

  const getExpensesByDay = () => {
    if (!activeTrip) return [];
    const dailyExpenses = {};

    activeTrip.expenses.forEach(expense => {
      if (!dailyExpenses[expense.date]) {
        dailyExpenses[expense.date] = 0;
      }
      dailyExpenses[expense.date] += expense.amount;
    });

    return Object.keys(dailyExpenses).map(date => ({
      date,
      amount: dailyExpenses[date]
    }));
  };

  const getExpensesByCategory = () => {
    if (!activeTrip) return [];
    const categoryExpenses = {};

    activeTrip.expenses.forEach(expense => {
      if (!categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] = 0;
      }
      categoryExpenses[expense.category] += expense.amount;
    });

    return Object.keys(categoryExpenses).map(category => ({
      category: getCategoryName(category),
      amount: categoryExpenses[category],
      id: category
    }));
  };

  const getExpenseSummary = () => {
    const totalBudget = getTotalBudget();
    const totalExpenses = getTotalExpenses();
    const remaining = totalBudget - totalExpenses;

    return {
      totalBudget,
      totalExpenses,
      remaining,
      percentUsed: totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0
    };
  };

  const getMoneyTips = () => {
    if (!activeTrip || activeTrip.expenses.length === 0) {
      return {
        category: 'general',
        tips: [
          "Set a daily spending limit before your trip",
          "Research the average costs at your destination",
          "Look for destination-specific discounts before traveling"
        ]
      };
    }

    // Find the category with highest spending
    const categoryTotals = {};
    expenseCategories.forEach(cat => {
      categoryTotals[cat.id] = calculateCategoryTotal(cat.id);
    });

    const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    return {
      category: getCategoryName(highestCategory),
      tips: MONEY_SAVING_TIPS[highestCategory] || MONEY_SAVING_TIPS.other
    };
  };

  // Filter expenses based on export options
  const filterExpenses = (expenses, filters) => {
    return expenses.filter(expense => {
      // Date range filter
      if (filters.dateRange) {
        const expenseDate = new Date(expense.fullDate || expense.date);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Set to end of day

        if (expenseDate < fromDate || expenseDate > toDate) {
          return false;
        }
      }

      // Category filter
      if (filters.categories && !filters.categories.includes(expense.category)) {
        return false;
      }

      return true;
    });
  };

  // Format date for exports
  const formatDate = (date, simple = false) => {
    if (!date) return '';

    const dateObj = new Date(date);

    if (simple) {
      return dateObj.toLocaleDateString('en-US');
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate CSV data
  const generateCSV = (expenses) => {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Currency'];

    const rows = expenses.map(exp => [
      formatDate(exp.date, true),
      getCategoryName(exp.category),
      exp.description,
      exp.amount.toFixed(2),
      getCurrencySymbol()
    ]);

    return [headers, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');
  };

  // Generate JSON data
  const generateJSON = (expenses) => {
    return JSON.stringify(
      expenses.map(exp => ({
        date: formatDate(exp.date, true),
        category: getCategoryName(exp.category),
        categoryId: exp.category,
        description: exp.description,
        amount: exp.amount,
        currency: getCurrencySymbol()
      })),
      null,
      2
    );
  };

  // Generate PDF document
  const generatePDF = (expenses, options) => {
    // Import jsPDF with autotable
    import('jspdf-autotable').then(() => { });

    const doc = new jsPDF();
    const currSymbol = getCurrencySymbol();

    // Add title
    doc.setFontSize(22);
    doc.text('VacayTracker Expense Report', 105, 20, { align: 'center' });

    // Add date range
    doc.setFontSize(12);
    doc.text(`Period: ${formatDate(options.dateRange.from)} - ${formatDate(options.dateRange.to)}`, 105, 30, { align: 'center' });

    // Add summary
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    doc.setFontSize(14);
    doc.text('Summary', 14, 45);
    doc.setFontSize(12);
    doc.text(`Total Expenses: ${currSymbol}${totalExpenses.toFixed(2)}`, 14, 55);

    if (options.pdfOptions.includeBudget) {
      const totalBudget = getTotalBudget();
      const remainingBudget = totalBudget - totalExpenses;

      doc.text(`Total Budget: ${currSymbol}${totalBudget.toFixed(2)}`, 14, 65);
      doc.text(`Remaining Budget: ${currSymbol}${remainingBudget.toFixed(2)}`, 14, 75);
    }

    let yPosition = options.pdfOptions.includeBudget ? 90 : 70;

    // Add charts if requested
    if (options.pdfOptions.includeCharts && expenses.length > 0) {
      doc.setFontSize(14);
      doc.text('Expense Overview', 14, yPosition);
      yPosition += 15;

      // Get data for charts
      const categoryExpensesData = getExpensesByCategory();

      // Create a canvas element for chart rendering
      const canvas = document.createElement('canvas');
      canvas.width = 600; // Increased width for better resolution
      canvas.height = 300; // Increased height for better resolution
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Clear canvas with white background
        ctx.fillStyle = darkMode ? '#1f2937' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set up for a modern donut chart
        const centerX = canvas.width * 0.3; // Position chart on the left side
        const centerY = canvas.height / 2;
        const outerRadius = Math.min(canvas.width * 0.25, canvas.height * 0.4);
        const innerRadius = outerRadius * 0.6; // Create donut hole

        // Calculate total for percentages
        const total = categoryExpensesData.reduce((sum, entry) => sum + entry.amount, 0);

        // Draw donut segments
        let startAngle = -0.5 * Math.PI; // Start from top
        categoryExpensesData.forEach((entry, index) => {
          const sliceAngle = (entry.amount / total) * 2 * Math.PI;

          // Get category color
          let color = getCategoryColor(entry.id);

          // Draw segment with slight padding between slices
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle * 0.98);
          ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle * 0.98, startAngle, true);
          ctx.closePath();

          // Fill with category color
          ctx.fillStyle = color;
          ctx.fill();

          // Add subtle shadow for depth
          ctx.shadowColor = 'rgba(0,0,0,0.1)';
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          // Add percentage in the middle of the segment if large enough
          const midAngle = startAngle + sliceAngle / 2;
          const percentageValue = Math.round((entry.amount / total) * 100);

          if (percentageValue >= 5) { // Only add text for segments that are 5% or larger
            const textRadius = (innerRadius + outerRadius) / 2;
            const textX = centerX + Math.cos(midAngle) * textRadius * 0.85;
            const textY = centerY + Math.sin(midAngle) * textRadius * 0.85;

            ctx.shadowColor = 'transparent'; // Remove shadow for text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Arial'; // Increased font size
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentageValue}%`, textX, textY);
          }

          startAngle += sliceAngle;
        });

        // Reset shadow for cleaner legend
        ctx.shadowColor = 'transparent';

        // Add a clean legend with better spacing
        let legendX = canvas.width * 0.58;
        let legendY = canvas.height * 0.25;
        const legendSpacing = 30; // Increased spacing between items

        // Add title to legend
        ctx.fillStyle = darkMode ? '#FFFFFF' : '#333333';
        ctx.font = 'bold 14px Arial'; // Clear, larger font
        ctx.textAlign = 'left';
        ctx.fillText('Category Breakdown', legendX, legendY - legendSpacing);

        // Format currency values with proper spacing
        const formatCurrency = (value) => {
          // Format to 0 decimal places
          return `${getCurrencySymbol()}${Math.round(value)}`;
        };

        // Calculate maximum width needed for the category names
        let maxCategoryWidth = 0;
        categoryExpensesData.forEach(entry => {
          const truncatedName = entry.category.length > 15 ?
            entry.category.substring(0, 12) + '...' :
            entry.category;
          const textWidth = ctx.measureText(`${truncatedName} (${Math.round((entry.amount / total) * 100)}%)`).width;
          maxCategoryWidth = Math.max(maxCategoryWidth, textWidth);
        });

        // Draw legend items
        ctx.font = '12px Arial'; // Clearer font
        categoryExpensesData.forEach((entry, index) => {
          if (index > 7) return; // Limit legend items to fit in PDF

          const color = getCategoryColor(entry.id);
          const percentage = Math.round((entry.amount / total) * 100); // Round to whole number

          // Draw colored circle
          ctx.beginPath();
          ctx.arc(legendX + 5, legendY, 6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          // Add category name and percentage
          ctx.fillStyle = darkMode ? '#FFFFFF' : '#333333';
          const truncatedName = entry.category.length > 15 ?
            entry.category.substring(0, 12) + '...' :
            entry.category;
          ctx.textAlign = 'left';
          ctx.fillText(
            `${truncatedName} (${percentage}%)`,
            legendX + 18,
            legendY + 4
          );

          // Add amount on the right with enough spacing
          ctx.textAlign = 'right';
          ctx.fillText(
            formatCurrency(entry.amount),
            legendX + maxCategoryWidth + 80, // Added extra space to prevent overlap
            legendY + 4
          );
          ctx.textAlign = 'left';

          legendY += legendSpacing;
        });

        // Add chart to PDF with improved resolution
        const chartImage = canvas.toDataURL('image/png', 1.0); // Use maximum quality
        doc.addImage(chartImage, 'PNG', 20, yPosition, 170, 85);

        yPosition += 95; // Move position after chart

        if (yPosition > 240) { // Lower threshold to ensure enough space for table header
          doc.addPage();
          yPosition = 20; // Reset yPosition for the new page
        }
      }
    }

    // Add category breakdown if requested
    if (options.pdfOptions.includeCategoryBreakdown) {

      // Check if we need a new page
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Category Breakdown', 14, yPosition);
      yPosition += 10;

      // Prepare category data
      const categoryExpenses = {};
      expenses.forEach(exp => {
        if (!categoryExpenses[exp.category]) {
          categoryExpenses[exp.category] = 0;
        }
        categoryExpenses[exp.category] += exp.amount;
      });

      // Create table data
      const tableData = Object.keys(categoryExpenses).map(catId => [
        getCategoryName(catId),
        `${currSymbol}${categoryExpenses[catId].toFixed(2)}`,
        `${((categoryExpenses[catId] / totalExpenses) * 100).toFixed(1)}%`
      ]);

      // Add table
      if (doc.autoTable) {
        doc.autoTable({
          startY: yPosition,
          head: [['Category', 'Amount', 'Percentage']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { top: 10 }
        });

        yPosition = doc.previousAutoTable.finalY + 15;
      } else {
        // Alternative table layout if autoTable is not available
        yPosition += 10;
        doc.setFontSize(10);
        doc.text('Category', 14, yPosition);
        doc.text('Amount', 80, yPosition);
        doc.text('Percentage', 140, yPosition);
        yPosition += 5;

        tableData.forEach(row => {
          yPosition += 8;
          doc.text(row[0], 14, yPosition);
          doc.text(row[1], 80, yPosition);
          doc.text(row[2], 140, yPosition);
        });

        yPosition += 15;
      }
    }

    // Check if we need a new page for expense details
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    // Add expense list
    doc.setFontSize(14);
    doc.text('Expense Details', 14, yPosition);
    yPosition += 10;

    // Prepare expense data for table
    const expenseRows = expenses.map(exp => [
      formatDate(exp.date, true),
      getCategoryName(exp.category),
      exp.description,
      `${currSymbol}${exp.amount.toFixed(2)}`
    ]);

    // Add expense table
    if (doc.autoTable) {
      doc.autoTable({
        startY: yPosition + 5,
        head: [['Date', 'Category', 'Description', 'Amount']],
        body: expenseRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });
    } else {
      // Alternative simple layout if autoTable isn't available
      yPosition += 10;
      doc.setFontSize(10);
      doc.text('Date', 14, yPosition);
      doc.text('Category', 50, yPosition);
      doc.text('Description', 100, yPosition);
      doc.text('Amount', 170, yPosition);

      // We'll just show first few expenses if autoTable isn't available
      const limitedRows = expenseRows.slice(0, 10);
      limitedRows.forEach((row, index) => {
        yPosition += 8;
        if (yPosition > 270) return; // Avoid overflow
        doc.text(row[0], 14, yPosition);
        doc.text(row[1].substring(0, 15), 50, yPosition);
        doc.text(row[2].substring(0, 20), 100, yPosition);
        doc.text(row[3], 170, yPosition);
      });
    }

    return doc;
  };

  // Handle export 
  const handleExport = async () => {
    try {
      if (!activeTrip) {
        setNotification({
          type: 'error',
          message: 'Please select a trip first'
        });
        return { success: false, error: 'No active trip' };
      }

      // Filter expenses
      const filteredExpenses = filterExpenses(activeTrip.expenses, exportOptions);

      if (filteredExpenses.length === 0) {
        setNotification({
          type: 'warning',
          message: 'No expenses match your selected filters'
        });
        return { success: false, error: 'No matching expenses' };
      }

      let fileData, mimeType, extension;

      // Generate file based on format
      switch (exportOptions.format) {
        case 'csv':
          fileData = generateCSV(filteredExpenses);
          mimeType = 'text/csv;charset=utf-8';
          extension = 'csv';
          break;

        case 'json':
          fileData = generateJSON(filteredExpenses);
          mimeType = 'application/json;charset=utf-8';
          extension = 'json';
          break;

        case 'pdf':
        default:
          const pdfDoc = generatePDF(filteredExpenses, exportOptions);
          fileData = pdfDoc.output('blob');
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;
      }

      // Create filename
      const filename = `${exportOptions.filename}.${extension}`;

      // Create blob from data if it's text
      const blob = exportOptions.format === 'pdf' ?
        fileData :
        new Blob([fileData], { type: mimeType });

      // Save the file
      saveAs(blob, filename);

      // Show success notification
      setNotification({
        type: 'success',
        message: `Expenses successfully exported to ${filename}`
      });

      // Close modal
      setShowExportModal(false);

      return {
        success: true,
        filename,
        fileData: blob,
        mimeType
      };
    } catch (error) {
      console.error('Export error:', error);

      // Show error notification
      setNotification({
        type: 'error',
        message: `Export failed: ${error.message || 'Unknown error'}`
      });

      return { success: false, error };
    } finally {
      // Clear notification after timeout
      setTimeout(() => {
        setNotification(null);
      }, CONSTANTS.NOTIFICATION_TIMEOUT);
    }
  };

  // Handle sharing exported file
  const handleShare = async () => {
    try {
      // First generate the export
      const exportResult = await handleExport();

      if (!exportResult.success) {
        return;
      }

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: 'VacayTracker Expenses',
          text: `My vacation expense report for ${activeTrip.name}`
        });
      } else {
        // Fallback to opening email client
        const emailSubject = encodeURIComponent('VacayTracker Expense Report');
        const emailBody = encodeURIComponent(`My vacation expense report for ${activeTrip.name}`);
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
      }

      setNotification({
        type: 'success',
        message: 'Sharing initiated successfully'
      });
    } catch (error) {
      console.error('Sharing error:', error);

      setNotification({
        type: 'error',
        message: `Sharing failed: ${error.message || 'Unknown error'}`
      });
    } finally {
      // Clear notification after timeout
      setTimeout(() => {
        setNotification(null);
      }, CONSTANTS.NOTIFICATION_TIMEOUT);
    }
  };

  // Handle expense submission
  const handleExpenseSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!activeTrip) {
      setNotification({
        type: 'error',
        message: 'Please create or select a trip first'
      });
      return;
    }

    if (!newExpense.description || !newExpense.amount) {
      setNotification({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid amount'
      });
      return;
    }

    const expense = {
      id: `expense-${Date.now()}`,
      description: newExpense.description,
      amount,
      category: newExpense.category,
      date: newExpense.date,
      fullDate: new Date()
    };

    // Update active trip with new expense
    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        const updatedExpenses = editingExpense
          ? trip.expenses.map(exp => exp.id === editingExpense.id ? expense : exp)
          : [...(trip.expenses || []), expense];

        return { ...trip, expenses: updatedExpenses };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setActiveTrip(prev => {
      if (prev && prev.id === activeTrip.id) {
        return { ...prev, expenses: prev.expenses ? [...prev.expenses, expense] : [expense] };
      }
      return prev;
    });

    // Check if over budget
    const categoryExpenses = calculateCategoryTotal(newExpense.category);
    const categoryBudget = budget[newExpense.category];

    if (categoryBudget > 0) {
      const percentUsed = ((categoryExpenses + amount) / categoryBudget) * 100;

      if (percentUsed >= CONSTANTS.BUDGET_DANGER_THRESHOLD) {
        setNotification({
          type: 'warning',
          message: `You've exceeded your ${getCategoryName(newExpense.category)} budget!`
        });
      } else if (percentUsed >= CONSTANTS.BUDGET_WARNING_THRESHOLD) {
        setNotification({
          type: 'info',
          message: `You're approaching your ${getCategoryName(newExpense.category)} budget limit`
        });
      } else {
        setNotification({
          type: 'success',
          message: 'Expense added successfully!'
        });
      }
    } else {
      setNotification({
        type: 'success',
        message: 'Expense added successfully!'
      });
    }

    setShowNewExpenseForm(false);
    setEditingExpense(null);
    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  // Handle expense deletion
  const handleExpenseDelete = (expenseId) => {
    if (!activeTrip) return;

    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        const updatedExpenses = trip.expenses.filter(expense => expense.id !== expenseId);
        return { ...trip, expenses: updatedExpenses };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setNotification({
      type: 'info',
      message: 'Expense deleted successfully!'
    });
    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  // Handle expense edit
  const handleExpenseEdit = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setShowNewExpenseForm(true);
  };

  // Update budget for active trip
  const handleBudgetUpdate = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!activeTrip) return;

    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        return { ...trip, budget: budget };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setEditingBudget(false);
    setNotification({
      type: 'success',
      message: 'Budget updated successfully!'
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  // Update header section to include trip information
  const renderHeader = () => {
    return (
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className={`ml-2 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>VacayTracker</h1>
            </div>
            <div className="flex items-center space-x-8">
              {/* Trip selector */}
              <div className="relative">
                <button
                  onClick={() => setShowTripSelector(true)}
                  className={`flex items-center px-3 py-2 rounded-lg ${activeTrip
                      ? 'bg-blue-100 text-blue-700'
                      : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  <Map size={16} className="mr-2" />
                  {activeTrip ? (
                    <span>{activeTrip.name}</span>
                  ) : (
                    <span>Select Trip</span>
                  )}
                </button>
              </div>

              {/* Notifications */}
              <div className="relative notifications-dropdown">
                <div className="relative">
                  <Bell
                    className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-pointer hover:text-blue-600`}
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (showSettings) setShowSettings(false);
                    }}
                  />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg z-50`}>
                    <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const updatedNotifications = notifications.map(notif => ({
                              ...notif,
                              read: true
                            }));
                            setNotifications(updatedNotifications);
                          }}
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer ${!notif.read ? darkMode ? 'bg-blue-900' : 'bg-blue-50' : ''}`}
                            onClick={() => {
                              const updatedNotifications = notifications.map(n =>
                                n.id === notif.id ? { ...n, read: true } : n
                              );
                              setNotifications(updatedNotifications);
                            }}
                          >
                            <div className="flex justify-between">
                              <p className={`text-sm ${!notif.read ? 'font-medium' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notif.message}</p>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notif.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                      <button
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={() => setNotifications([])}
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="relative settings-dropdown">
                <Settings
                  className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-pointer hover:text-blue-600`}
                  onClick={() => {
                    setShowSettings(!showSettings);
                    if (showNotifications) setShowNotifications(false);
                  }}
                />
                {showSettings && (
                  <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg z-50`}>
                    <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Currency</label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md`}
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="CAD">CAD (C$)</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</label>
                          <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span
                              className={`inline-block w-4 h-4 transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'} rounded-full bg-white`}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <button
                          onClick={() => {
                            setShowExportModal(true);
                            setShowSettings(false);
                          }}
                          className={`w-full p-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm flex items-center justify-center`}
                        >
                          <Download size={16} className="mr-2" />
                          Export Data
                        </button>
                      </div>
                      <div className="mb-2">
                        <button
                          onClick={() => {
                            setShowAccountSettings(true);
                            setShowSettings(false);
                          }}
                          className={`w-full p-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm`}
                        >
                          Account Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Render Export Modal
  const renderExportModal = () => {
    if (!showExportModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-xl`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Export Expense Data
            </h2>
            <button
              className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setShowExportModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Format</label>
            <div className="flex space-x-4">
              {['csv', 'pdf', 'json'].map(format => (
                <label key={format} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="exportFormat"
                    value={format}
                    checked={exportOptions.format === format}
                    onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
                  />
                  <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {format.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={`p-4 mb-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center`}>
              <Filter size={16} className="mr-1" /> Data Filters
            </h3>

            <div className="mb-3">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>From</label>
                  <input
                    type="date"
                    value={exportOptions.dateRange.from}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      dateRange: { ...exportOptions.dateRange, from: e.target.value }
                    })}
                    className={`mt-1 block w-full rounded-md text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'
                      }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>To</label>
                  <input
                    type="date"
                    value={exportOptions.dateRange.to}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      dateRange: { ...exportOptions.dateRange, to: e.target.value }
                    })}
                    className={`mt-1 block w-full rounded-md text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'
                      }`}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Categories</label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {expenseCategories.map((category) => (
                  <label key={category.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox rounded"
                      checked={exportOptions.categories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExportOptions({
                            ...exportOptions,
                            categories: [...exportOptions.categories, category.id]
                          });
                        } else {
                          setExportOptions({
                            ...exportOptions,
                            categories: exportOptions.categories.filter(cat => cat !== category.id)
                          });
                        }
                      }}
                    />
                    <span
                      className="ml-2 flex items-center"
                      style={{ color: category.color }}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {exportOptions.format === 'pdf' && (
            <div className={`p-4 mb-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center`}>
                <FileText size={16} className="mr-1" /> PDF Options
              </h3>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded"
                    checked={exportOptions.pdfOptions.includeBudget}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      pdfOptions: { ...exportOptions.pdfOptions, includeBudget: e.target.checked }
                    })}
                  />
                  <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Include Budget Information
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded"
                    checked={exportOptions.pdfOptions.includeCharts}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      pdfOptions: { ...exportOptions.pdfOptions, includeCharts: e.target.checked }
                    })}
                  />
                  <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Include Expense Charts
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded"
                    checked={exportOptions.pdfOptions.includeCategoryBreakdown}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      pdfOptions: { ...exportOptions.pdfOptions, includeCategoryBreakdown: e.target.checked }
                    })}
                  />
                  <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Include Category Breakdown
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Filename</label>
            <div className="flex">
              <input
                type="text"
                value={exportOptions.filename}
                onChange={(e) => setExportOptions({ ...exportOptions, filename: e.target.value })}
                className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              />
              <span className={`p-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                .{exportOptions.format}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              onClick={() => setShowExportModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-1" /> Export
            </button>
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
              onClick={handleShare}
            >
              <Share2 size={16} className="mr-1" /> Export & Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render trip selector
  const renderTripSelector = () => {
    if (!showTripSelector) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Select Trip
            </h2>
            <button
              className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setShowTripSelector(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {trips.map(trip => (
              <div
                key={trip.id}
                className={`p-3 rounded-lg cursor-pointer border-2 ${activeTrip?.id === trip.id
                    ? 'border-blue-500 bg-blue-50'
                    : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}
                onClick={() => {
                  setActiveTrip(trip);
                  setShowTripSelector(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {trip.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin size={14} className="inline mr-1" />
                      {trip.destination}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {trip.status === 'closed' ? (
                      <Lock size={16} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    ) : (
                      <Unlock size={16} className={`${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700"
            onClick={() => {
              setShowTripSelector(false);
              setShowNewTripForm(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Create New Trip
          </button>
        </div>
      </div>
    );
  };

  // Render new trip form
  const renderNewTripForm = () => {
    if (!showNewTripForm) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Create New Trip
            </h2>
            <button
              className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setShowNewTripForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Trip Name
              </label>
              <input
                type="text"
                value={newTrip.name}
                onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Summer Vacation"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Destination
              </label>
              <input
                type="text"
                value={newTrip.destination}
                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Paris, France"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={newTrip.startDate}
                  onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                  className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  End Date
                </label>
                <input
                  type="date"
                  value={newTrip.endDate}
                  onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                  className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`mr-2 px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              onClick={() => setShowNewTripForm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateTrip}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Trip
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Update notification system
  const renderNotification = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'error' ? (darkMode ? 'bg-red-900 border-red-600' : 'bg-red-100 border-red-500') :
      notification.type === 'warning' ? (darkMode ? 'bg-yellow-900 border-yellow-600' : 'bg-yellow-100 border-yellow-500') :
        notification.type === 'info' ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-100 border-blue-500') :
          darkMode ? 'bg-green-900 border-green-600' : 'bg-green-100 border-green-500';

    const textColor = notification.type === 'error' ? (darkMode ? 'text-red-300' : 'text-red-700') :
      notification.type === 'warning' ? (darkMode ? 'text-yellow-300' : 'text-yellow-700') :
        notification.type === 'info' ? (darkMode ? 'text-blue-300' : 'text-blue-700') :
          darkMode ? 'text-green-300' : 'text-green-700';

    return (
      <div className={`fixed top-4 right-4 max-w-xs p-4 rounded-lg border ${bgColor} ${textColor}`}>
        {notification.message}
      </div>
    );
  };

  // Enhanced tabs rendering with trip context
  const renderTabs = () => {
    return (
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 mr-2 font-medium ${activeTab === 'dashboard' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 mr-2 font-medium ${activeTab === 'expenses' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')} ${!activeTrip ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => activeTrip && setActiveTab('expenses')}
          disabled={!activeTrip}
        >
          Expenses
        </button>
        <button
          className={`px-4 py-2 mr-2 font-medium ${activeTab === 'budget' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')} ${!activeTrip ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => activeTrip && setActiveTab('budget')}
          disabled={!activeTrip}
        >
          Budget
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'tips' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
          onClick={() => setActiveTab('tips')}
        >
          Travel Tips
        </button>
      </div>
    );
  };

  // Complete renderDashboard with all dashboard content
  const renderDashboard = () => {
    if (!activeTrip) {
      return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-8 text-center`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Welcome to VacayTracker
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Start by creating a trip to track your vacation expenses
          </p>
          <button
            onClick={() => setShowNewTripForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Your First Trip
          </button>
        </div>
      );
    }

    const summary = getExpenseSummary();
    const dailyExpenses = getExpensesByDay();
    const categoryExpenses = getExpensesByCategory();
    const currSymbol = getCurrencySymbol();

    return (
      <div>
        {/* Active trip card */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow mb-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeTrip.name}
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                <MapPin size={16} className="inline mr-1" />
                {activeTrip.destination}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {new Date(activeTrip.startDate).toLocaleDateString()} - {new Date(activeTrip.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              {activeTrip.status === 'open' ? (
                <button
                  onClick={() => handleCloseTrip(activeTrip.id)}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Close Trip
                </button>
              ) : (
                <button
                  onClick={() => handleReopenTrip(activeTrip.id)}
                  className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Reopen Trip
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Total Spent</h3>
            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{currSymbol}{summary.totalExpenses.toFixed(2)}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>of {currSymbol}{summary.totalBudget.toFixed(2)} budget</p>
            <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 mt-2`}>
              <div
                className={`h-2.5 rounded-full ${summary.percentUsed > CONSTANTS.BUDGET_DANGER_THRESHOLD ? 'bg-red-500' : summary.percentUsed > CONSTANTS.BUDGET_WARNING_THRESHOLD ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Remaining Budget</h3>
            <p className={`text-2xl font-bold ${summary.remaining >= 0 ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
              {currSymbol}{summary.remaining.toFixed(2)}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {summary.remaining >= 0 ? 'Still available to spend' : 'Over budget'}
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Recent Activity</h3>
            {activeTrip.expenses.length > 0 ? (
              <div>
                {activeTrip.expenses.slice(-1).map(expense => (
                  <div key={expense.id} className="mb-2">
                    <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{expense.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{expense.date}</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{currSymbol}{expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-500'} cursor-pointer mt-2`} onClick={() => setActiveTab('expenses')}>
                  View all expenses →
                </p>
              </div>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No expenses recorded yet
              </p>
            )}
          </div>
        </div>

        {/* Charts section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Spending Overview</h3>
            <div className="flex space-x-2">
              <button
                className={`p-1 rounded ${chartType === 'pie' ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                onClick={() => setChartType('pie')}
              >
                Pie
              </button>
              <button
                className={`p-1 rounded ${chartType === 'bar' ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                onClick={() => setChartType('bar')}
              >
                Bar
              </button>
              <button
                className={`p-1 rounded ${chartType === 'line' ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                onClick={() => setChartType('line')}
              >
                Line
              </button>
            </div>
          </div>

          {activeTrip.expenses.length === 0 ? (
            <div className={`flex items-center justify-center h-64 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>Add expenses to see your spending charts</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={CONSTANTS.CHART_OUTER_RADIUS}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.id)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${getCurrencySymbol()}${value.toFixed(2)}`}
                      contentStyle={darkMode ? { backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' } : {}}
                      itemStyle={darkMode ? { color: '#F9FAFB' } : {}}
                    />
                  </PieChart>
                ) : chartType === 'bar' ? (
                  <BarChart
                    data={categoryExpenses}
                    margin={CONSTANTS.CHART_MARGINS}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }}
                      axisLine={{ stroke: darkMode ? '#6B7280' : '#D1D5DB' }}
                    />
                    <YAxis
                      tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }}
                      axisLine={{ stroke: darkMode ? '#6B7280' : '#D1D5DB' }}
                    />
                    <Tooltip
                      formatter={(value) => `${getCurrencySymbol()}${value.toFixed(2)}`}
                      contentStyle={darkMode ? { backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' } : {}}
                      itemStyle={darkMode ? { color: '#F9FAFB' } : {}}
                    />
                    <Bar dataKey="amount" name="Amount">
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.id)} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <LineChart
                    data={dailyExpenses}
                    margin={CONSTANTS.CHART_MARGINS}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }}
                      axisLine={{ stroke: darkMode ? '#6B7280' : '#D1D5DB' }}
                    />
                    <YAxis
                      tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }}
                      axisLine={{ stroke: darkMode ? '#6B7280' : '#D1D5DB' }}
                    />
                    <Tooltip
                      formatter={(value) => `${getCurrencySymbol()}${value.toFixed(2)}`}
                      contentStyle={darkMode ? { backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' } : {}}
                      itemStyle={darkMode ? { color: '#F9FAFB' } : {}}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={darkMode ? '#60A5FA' : COLORS.primary}
                      activeDot={{ r: 8 }}
                      name="Daily Expenses"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Add expense button only if trip is open */}
        {activeTrip?.status === 'open' && (
          <button
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
            onClick={() => setShowNewExpenseForm(true)}
          >
            <Plus size={24} />
          </button>
        )}
      </div>
    );
  };

  const renderExpensesTab = () => {
    const currSymbol = getCurrencySymbol();

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Expenses</h2>
          {activeTrip?.status === 'open' && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
              onClick={() => setShowNewExpenseForm(true)}
            >
              <Plus size={16} className="mr-1" />
              Add Expense
            </button>
          )}
        </div>

        {!activeTrip || activeTrip.expenses.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 text-center`}>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {!activeTrip ? "No active trip selected" : "No expenses recorded yet"}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
              {!activeTrip ? "Select a trip to view expenses" : "Click the \"Add Expense\" button to get started"}
            </p>
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Description</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Category</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                    <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {activeTrip.expenses.map((expense) => (
                    <tr key={expense.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{expense.date}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{expense.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: darkMode ? `${getCategoryColor(expense.category)}30` : `${getCategoryColor(expense.category)}20`,
                            color: getCategoryColor(expense.category)
                          }}
                        >
                          {getCategoryName(expense.category)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currSymbol}{expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {activeTrip.status === 'open' && (
                          <>
                            <button
                              onClick={() => handleExpenseEdit(expense)}
                              className={`text-sm mr-3 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this expense?')) {
                                  handleExpenseDelete(expense.id);
                                }
                              }}
                              className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBudgetTab = () => {
    const currSymbol = getCurrencySymbol();

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Budget Settings</h2>
          {activeTrip?.status === 'open' && (
            <button
              className={`${editingBudget ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-lg hover:${editingBudget ? 'bg-green-700' : 'bg-blue-700'}`}
              onClick={() => editingBudget ? handleBudgetUpdate() : setEditingBudget(true)}
            >
              {editingBudget ? 'Save Budget' : 'Edit Budget'}
            </button>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          {!activeTrip ? (
            <div className="text-center py-4">
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No active trip selected</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Select a trip to manage your budget
              </p>
            </div>
          ) : editingBudget ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{category.name}</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>{currSymbol}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={budget[category.id] || 0}
                        onChange={(e) => setBudget({ ...budget, [category.id]: parseFloat(e.target.value) || 0 })}
                        className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          } rounded-md`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className={`mr-2 px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    } rounded-md shadow-sm text-sm font-medium`}
                  onClick={() => setEditingBudget(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleBudgetUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Total Budget: {currSymbol}{getTotalBudget().toFixed(2)}</h3>

                {getTotalBudget() === 0 ? (
                  <div className="text-center py-4">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No budget set</p>
                    {activeTrip.status === 'open' && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click "Edit Budget" to set up your spending limits
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Allocation by category:</p>

                    {expenseCategories.map((category) => {
                      const spent = calculateCategoryTotal(category.id);
                      const budgetAmount = budget[category.id] || 0;
                      const percentUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

                      return (
                        <div key={category.id} className="mb-4">
                          <div className="flex justify-between mb-1">
                            <div>
                              <span
                                className="inline-block w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              ></span>
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category.name}</span>
                            </div>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {currSymbol}{spent.toFixed(2)} of {currSymbol}{budgetAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                            <div
                              className={`h-2 rounded-full ${percentUsed > CONSTANTS.BUDGET_DANGER_THRESHOLD ? 'bg-red-500' :
                                  percentUsed > CONSTANTS.BUDGET_WARNING_THRESHOLD ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                              style={{ width: `${Math.min(percentUsed, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
                <h3 className={`text-md font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>Budget Tips</h3>
                <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <li className="mb-1">Set realistic budgets for each category based on destination costs</li>
                  <li className="mb-1">Allow for a 10-15% buffer in your total budget for unexpected expenses</li>
                  <li className="mb-1">Review your spending patterns regularly and adjust budgets as needed</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTipsTab = () => {
    const tips = getMoneyTips();
    const highestSpendingCategory = tips.category;

    return (
      <div>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Travel Money Saving Tips</h2>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
            Tips for <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{highestSpendingCategory}</span> (Your Highest Expense)
          </h3>
          <ul className="space-y-2">
            {tips.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className={`${darkMode ? 'text-green-400' : 'text-green-500'} mr-2`}>💰</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>General Travel Savings</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>1.</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Travel during shoulder season (just before or after peak season) for better deals</span>
              </li>
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>2.</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use credit cards with no foreign transaction fees and travel rewards</span>
              </li>
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>3.</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Book flights 2-3 months in advance for the best prices</span>
              </li>
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>4.</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Consider travel insurance for expensive trips to avoid unexpected costs</span>
              </li>
            </ul>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Destination-Specific Advice</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Based on your spending pattern, here are some location-specific tips:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>•</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Look for city passes that include public transportation and attractions</span>
              </li>
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>•</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Research local happy hours and dining specials before your trip</span>
              </li>
              <li className="flex items-start">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 font-bold`}>•</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exchange currency at banks rather than airports or tourist areas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderNewExpenseForm = () => {
    if (!showNewExpenseForm) return null;

    const currSymbol = getCurrencySymbol();

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button
              className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setShowNewExpenseForm(false);
                setEditingExpense(null);
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Dinner at restaurant"
              />
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Amount</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>{currSymbol}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                    } rounded-md`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              >
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className={`mr-2 px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                onClick={() => {
                  setShowNewExpenseForm(false);
                  setEditingExpense(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExpenseSubmit}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {renderHeader()}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabs()}

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'expenses' && renderExpensesTab()}
        {activeTab === 'budget' && renderBudgetTab()}
        {activeTab === 'tips' && renderTipsTab()}

        {renderNewExpenseForm()}
        {renderNewTripForm()}
        {renderTripSelector()}
        {renderExportModal()}
        {renderNotification()}
      </main>

      {showAccountSettings && (
        <AccountSettings
          onClose={() => setShowAccountSettings(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default VacationExpenseTracker;