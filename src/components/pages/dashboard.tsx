import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { LineChart } from '../charts/line-chart';
import { Card } from '../ui/card';

export const Dashboard: React.FC = () => {
  const { loading, stats, topStrategies, userStats } = useDashboard();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Value Locked</h3>
            <p className="text-2xl">${stats.tvl.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Average APY</h3>
            <p className="text-2xl">{stats.apy}%</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Strategies</h3>
            <p className="text-2xl">{stats.totalStrategies}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl">{stats.totalUsers}</p>
          </div>
        </Card>
      </div>

      {/* TVL Chart */}
      <Card className="mb-8">
        <LineChart />
      </Card>

      {/* Top Strategies */}
      <h2 className="text-2xl font-bold mb-4">Available Strategies</h2>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {topStrategies.map(strategy => (
          <Card key={strategy.id}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{strategy.name}</h3>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  strategy.risk === 'low' ? 'bg-green-100 text-green-800' :
                  strategy.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {strategy.risk.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">TVL</p>
                  <p className="text-lg">${strategy.tvl.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">APY</p>
                  <p className="text-lg text-green-600">{strategy.apy}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily APY</p>
                  <p className="text-lg text-green-600">{(strategy.dailyAPY || 0).toFixed(3)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit Token</p>
                  <p className="text-lg">{strategy.depositToken}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User Stats */}
      <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Deposited</h3>
            <p className="text-2xl">${userStats.totalDeposited.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Earned</h3>
            <p className="text-2xl text-green-600">${userStats.totalEarned.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Active Strategies</h3>
            <p className="text-2xl">{userStats.activeStrategies}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}; 