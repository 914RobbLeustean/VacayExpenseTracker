import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { getExpensesByDay, getExpensesByCategory } from '../../utils/calculations';
import { getCategoryInfo } from '../../utils/categoryHelpers';
import { getCurrencySymbol } from '../../utils/currency';
import { CONSTANTS } from '../../utils/constants';

const Charts = () => {
  const { activeTrip, darkMode, currency, expenseCategories } = useApp();
  const [chartType, setChartType] = useState('pie');
  
  const dailyExpenses = getExpensesByDay(activeTrip);
  const categoryExpenses = getExpensesByCategory(activeTrip, (catId, type) => 
    getCategoryInfo(catId, expenseCategories, type)
  );
  const currSymbol = getCurrencySymbol(currency);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Spending Overview
        </h3>
        <div className="flex space-x-2">
          <button 
            className={`p-1 rounded ${
              chartType === 'pie' ? 
                (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : 
                (darkMode ? 'text-gray-400' : 'text-gray-500')
            }`}
            onClick={() => setChartType('pie')}
          >
            Pie
          </button>
          <button 
            className={`p-1 rounded ${
              chartType === 'bar' ? 
                (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : 
                (darkMode ? 'text-gray-400' : 'text-gray-500')
            }`}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
          <button 
            className={`p-1 rounded ${
              chartType === 'line' ? 
                (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : 
                (darkMode ? 'text-gray-400' : 'text-gray-500')
            }`}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
        </div>
      </div>
      
      {activeTrip.expenses?.length === 0 ? (
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
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getCategoryInfo(entry.id, expenseCategories, 'color')} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${currSymbol}${value.toFixed(2)}`} 
                  contentStyle={darkMode ? { backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' } : {}} 
                  itemStyle={darkMode ? { color: '#F9FAFB' } : {}}
                />
              </PieChart>
            ) : chartType === 'bar' ? (
              <BarChart data={categoryExpenses} margin={CONSTANTS.CHART_MARGINS}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                <XAxis dataKey="category" tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }} />
                <YAxis tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }} />
                <Tooltip 
                  formatter={(value) => `${currSymbol}${value.toFixed(2)}`}
                  contentStyle={darkMode ? { backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' } : {}} 
                />
                <Bar dataKey="amount" name="Amount">
                  {categoryExpenses.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getCategoryInfo(entry.id, expenseCategories, 'color')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={dailyExpenses} margin={CONSTANTS.CHART_MARGINS}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                <XAxis dataKey="date" tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }} />
                <YAxis tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }} />
                <Tooltip 
                  formatter={(value) => `${currSymbol}${value.toFixed(2)}`}
                  contentStyle={darkMode ? { backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' } : {}} 
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={darkMode ? '#60A5FA' : '#3b82f6'}
                  activeDot={{ r: 8 }}
                  name="Daily Expenses"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Charts;