import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [
  { time: '10:00', value: 23 },
  { time: '13:00', value: 24 },
  { time: '16:00', value: 24 },
  { time: '19:00', value: 21 },
  { time: '22:00', value: 20 },
  { time: '01:00', value: 19 },
  { time: '04:00', value: 19 },
  { time: '07:00', value: 18 },
  { time: '07:30', value: 19 }, // Slight rise at the end
];

export default function HourlyGraph() {
  return (
    <div className='w-full flex items-center justify-center'>
      <LineChart
        xAxis={[{ scaleType: 'point', data: data.map(d => d.time) }]}
        yAxis={[{
          tickMinStep: Infinity, // Prevents tick labels
          label: '', // Hides the Y-axis label
          tickLabelStyle: { fontSize: 24, fill: 'white' }
        }]}
        series={[{
          data: data.map(d => d.value),
          color: '#2c6ca4', // Customize line color
          area: true, // Enables the filled area below the line
        
          
        }]}
        width={300}
        height={150}
      />
    </div>
  );
}