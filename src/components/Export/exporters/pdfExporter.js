import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '../../../utils/dateFormatters';
import { getCurrencySymbol } from '../../../utils/currency';
import { getCategoryInfo } from '../../../utils/categoryHelpers';
import { getTotalBudget} from '../../../utils/calculations';

export const generatePDF = (expenses, options, activeTrip, currency, expenseCategories, darkMode) => {
  // Import jsPDF with autotable
  import('jspdf-autotable').then(() => { });

  const doc = new jsPDF();
  const currSymbol = getCurrencySymbol(currency);

  // Helper functions to match the original
  const getCategoryName = (categoryId) => {
    return getCategoryInfo(categoryId, expenseCategories, 'name');
  };

  const getCategoryColor = (categoryId) => {
    return getCategoryInfo(categoryId, expenseCategories, 'color');
  };

  // Get expenses by category for charts
  const getExpensesByCategoryForChart = () => {
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
    const totalBudget = getTotalBudget(activeTrip);
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
    const categoryExpensesData = getExpensesByCategoryForChart();

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
        return `${currSymbol}${Math.round(value)}`;
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