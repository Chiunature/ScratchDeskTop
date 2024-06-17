import React, { useMemo, useState } from 'react';
import ReactEcharts from "echarts-for-react"

const initialOption = {
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [0],
      type: 'line',
      smooth: true
    }
  ]
};

const DataViewCom = ({ deviceObj }) => {
  const [options, setOptions] = useState(initialOption);

  const gyrolist = useMemo(() => deviceObj?.gyrolist, [deviceObj?.gyrolist]);

  const getOption = useMemo(() => {
    if (!gyrolist) return null;
    const xAxisData = Object.keys(gyrolist);
    const seriesData = Object.values(gyrolist);
    
    return {
      ...options,
      xAxis: {
        ...options.xAxis,
        data: xAxisData
      },
      series: [
        {
          ...options.series[0],
          data: seriesData
        }
      ]
    };
  }, [gyrolist]);

  return (
    <>
      {gyrolist && <ReactEcharts
        option={getOption}
        lazyUpdate={true}
        style={{ width: '600px', height: '400px' }}
      />}
    </>
  );
};

export default DataViewCom;