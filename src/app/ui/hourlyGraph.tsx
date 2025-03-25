import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function HourlyGraph() {
  return (
    <div className='overflow-x-auto flex '>

   
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      
      width={400}
      height={200}
      disableAxisListener
    />
    </div>
  );
}