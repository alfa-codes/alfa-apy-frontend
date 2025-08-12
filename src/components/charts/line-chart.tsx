import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


export interface LineChartSeries {
  name: string;
  data: { x: number; y: number }[];
  color: string;
}

interface LineChartProps {
  period: '24h' | '1w' | '1m';
  series: LineChartSeries[];
}

// Helper to convert hex to rgba (supports 3 or 6 digit hex)
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) return hex;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const LineChart: React.FC<LineChartProps> = ({ series = [], period = '24h' }) => {
  const chartSeries: Highcharts.SeriesAreaOptions[] = series.map(s => ({
    name: s.name,
    data: s.data,
    type: 'area',
    color: s.color,
    lineWidth: 2,
    marker: { enabled: true, radius: 4, symbol: 'circle', lineWidth: 0 },
    fillColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, hexToRgba(s.color, 0.3)],
        [1, hexToRgba(s.color, 0)]
      ]
    }
  }));

  const options: Highcharts.Options = {
    title: { text: undefined },
    chart: {
      backgroundColor: 'transparent',
      spacing: [10, 10, 10, 10],
      margin: [40, 60, 60, 60],
      borderWidth: 1,
      borderColor: '#ddd',
      plotBorderWidth: 1,
      plotBorderColor: '#ddd'
    },
    xAxis: {
      type: 'linear',
      labels: { 
        enabled: true, 
        style: { color: '#333', fontSize: '12px', fontWeight: 'bold' }
      },
      lineWidth: 2,
      lineColor: '#333',
      gridLineWidth: 1,
      gridLineColor: '#e0e0e0',
      tickWidth: 2,
      tickColor: '#333',
      title: { 
        text: period === '24h' ? 'Hours' : 'Days', 
        style: { color: '#333', fontSize: '14px', fontWeight: 'bold' } 
      },
      tickInterval: period === '24h' ? 1 : period === '1w' ? 1 : 5,
      min: 0,
      max: period === '24h' ? 23 : period === '1w' ? 6 : 29
    },
    yAxis: {
      title: { 
        text: 'APY (%)', 
        style: { color: '#333', fontSize: '14px', fontWeight: 'bold' } 
      },
      labels: { 
        enabled: true, 
        style: { color: '#333', fontSize: '12px', fontWeight: 'bold' }
      },
      gridLineWidth: 1,
      gridLineColor: '#e0e0e0',
      lineWidth: 2,
      lineColor: '#333',
      opposite: false
    },
    series: chartSeries,
    credits: { enabled: false },
    legend: {
      enabled: false,
    },
    tooltip: { 
      enabled: true,
      formatter: function() {
        const timeLabel = period === '24h' ? 'Hour' : 'Day';
        const timeUnit = period === '24h' ? 'h' : 'd';
        return `<b>${this.series.name}</b><br/>
                ${timeLabel}: ${this.x}${timeUnit}<br/>
                APY: ${this.y}%`;
      }
    }
  };



  return (
    <div className="relative w-full h-[400px] pb-12">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options}
      />
    </div>
  );
}; 