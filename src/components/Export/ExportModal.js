import React from 'react';
import { Download, X, Filter, FileText, Share2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exportCSV } from './exporters/csvExporter';
import { exportJSON } from './exporters/jsonExporter';
import { generatePDF } from './exporters/pdfExporter';
import { filterExpenses } from '../../utils/exportHelpers';
import { saveAs } from 'file-saver';

const ExportModal = () => {
  const { 
    darkMode, 
    showExportModal, 
    setShowExportModal,
    activeTrip,
    currency,
    expenseCategories,
    setNotification,
    exportOptions,
    setExportOptions
  } = useApp();
  
  const handleExport = async (shouldShare = false) => {
    try {
      if (!activeTrip) {
        setNotification({
          type: 'error',
          message: 'Please select a trip first'
        });
        return;
      }

      const filteredExpenses = filterExpenses(activeTrip.expenses, exportOptions);
      
      if (filteredExpenses.length === 0) {
        setNotification({
          type: 'warning',
          message: 'No expenses match your selected filters'
        });
        return;
      }

      let fileData, mimeType, extension;

      switch(exportOptions.format) {
        case 'csv':
          fileData = exportCSV(filteredExpenses, currency, expenseCategories);
          mimeType = 'text/csv;charset=utf-8';
          extension = 'csv';
          break;
        
        case 'json':
          fileData = exportJSON(filteredExpenses, currency, expenseCategories);
          mimeType = 'application/json;charset=utf-8';
          extension = 'json';
          break;
        
        case 'pdf':
        default:
          const pdfDoc = generatePDF(filteredExpenses, exportOptions, activeTrip, currency, expenseCategories, darkMode);
          fileData = pdfDoc.output('blob');
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;
      }

      const filename = `${exportOptions.filename}.${extension}`;
      const blob = exportOptions.format === 'pdf' ? fileData : new Blob([fileData], { type: mimeType });
      
      if (shouldShare) {
        if (navigator.share) {
          try {
            await navigator.share({
              title: filename,
              files: [new File([blob], filename, { type: mimeType })]
            });
          } catch (error) {
            console.error('Error sharing:', error);
            setNotification({
              type: 'error',
              message: 'Sharing failed. Please try downloading instead.'
            });
          }
        } else {
          setNotification({
            type: 'warning',
            message: 'Sharing is not supported in your browser. File has been downloaded instead.'
          });
          saveAs(blob, filename);
        }
      } else {
        saveAs(blob, filename);
      }
      
      setNotification({
        type: 'success',
        message: `Expenses successfully ${shouldShare ? 'shared' : 'exported'} to ${filename}`
      });
      
      setShowExportModal(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Export failed: ${error.message || 'Unknown error'}`
      });
    }
  };

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
        
        {/* Export format selection */}
        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Format
          </label>
          <div className="flex space-x-4">
            {['csv', 'pdf', 'json'].map(format => (
              <label key={format} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="exportFormat"
                  value={format}
                  checked={exportOptions.format === format}
                  onChange={(e) => setExportOptions({...exportOptions, format: e.target.value})}
                />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {format.toUpperCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Date range filter */}
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
                  className={`mt-1 block w-full rounded-md text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'}`}
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
                  className={`mt-1 block w-full rounded-md text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'}`}
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
                  <span className="ml-2 flex items-center" style={{ color: category.color }}>
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: category.color }}></span>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {category.name}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Options */}
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
        
        {/* Filename */}
        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Filename</label>
          <div className="flex">
            <input
              type="text"
              value={exportOptions.filename}
              onChange={(e) => setExportOptions({ ...exportOptions, filename: e.target.value })}
              className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
            <span className={`p-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              .{exportOptions.format}
            </span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
            onClick={() => setShowExportModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={() => handleExport(false)}
          >
            <Download size={16} className="mr-1" /> Export
          </button>
          <button
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
            onClick={() => handleExport(true)}
          >
            <Share2 size={16} className="mr-1" /> Export & Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;