import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { StockForm } from './components/StockForm';
import type { Stock, PortfolioMetrics } from './types/stock';

// Mock data for initial development
const mockStocks: Stock[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 1, buyPrice: 150.00, currentPrice: 175.50 },
  { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 1, buyPrice: 2800.00, currentPrice: 2950.00 },
  { id: '3', symbol: 'MSFT', name: 'Microsoft Corporation', quantity: 1, buyPrice: 280.00, currentPrice: 310.25 },
  { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 1, buyPrice: 3200.00, currentPrice: 3350.75 },
  { id: '5', symbol: 'TSLA', name: 'Tesla Inc.', quantity: 1, buyPrice: 900.00, currentPrice: 875.50 },
];

function App() {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalGainLoss: 0,
    topPerformer: null,
    worstPerformer: null,
  });

  useEffect(() => {
    // Calculate portfolio metrics
    const totalValue = stocks.reduce((sum, stock) => sum + stock.currentPrice * stock.quantity, 0);
    const totalGainLoss = stocks.reduce(
      (sum, stock) => sum + (stock.currentPrice - stock.buyPrice) * stock.quantity,
      0
    );

    const performanceList = stocks.map(stock => ({
      ...stock,
      performance: ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100
    }));

    const topPerformer = performanceList.reduce((max, stock) => 
      stock.performance > (max?.performance || -Infinity) ? stock : max
    , null);

    const worstPerformer = performanceList.reduce((min, stock) => 
      stock.performance < (min?.performance || Infinity) ? stock : min
    , null);

    setMetrics({
      totalValue,
      totalGainLoss,
      topPerformer,
      worstPerformer,
    });
  }, [stocks]);

  const handleAddStock = (stockData: Partial<Stock>) => {
    const newStock: Stock = {
      id: Date.now().toString(),
      symbol: stockData.symbol!,
      name: stockData.name!,
      quantity: stockData.quantity!,
      buyPrice: stockData.buyPrice!,
      currentPrice: stockData.buyPrice!, // In a real app, this would come from an API
    };

    setStocks([...stocks, newStock]);
    setShowForm(false);
  };

  const handleEditStock = (stockData: Partial<Stock>) => {
    if (!editingStock) return;

    const updatedStocks = stocks.map(stock =>
      stock.id === editingStock.id
        ? { ...stock, ...stockData }
        : stock
    );

    setStocks(updatedStocks);
    setEditingStock(null);
    setShowForm(false);
  };

  const handleDeleteStock = (id: string) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
        </div>

        <Dashboard metrics={metrics} />

        <div className="mb-8">
          <button
            onClick={() => {
              setEditingStock(null);
              setShowForm(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add New Stock
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <StockForm
              stock={editingStock || undefined}
              onSubmit={editingStock ? handleEditStock : handleAddStock}
              onCancel={() => {
                setShowForm(false);
                setEditingStock(null);
              }}
            />
          </div>
        )}

        <StockList
          stocks={stocks}
          onEdit={(stock) => {
            setEditingStock(stock);
            setShowForm(true);
          }}
          onDelete={handleDeleteStock}
        />
      </div>
    </div>
  );
}

export default App;