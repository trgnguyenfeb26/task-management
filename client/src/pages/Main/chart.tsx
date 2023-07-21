import React, { FC } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ChartTemplateProps {
  data: { name: string; value: number }[];
  color: string;
  name: string;
  lineThickness: number;
}

const ChartTemplate: FC<ChartTemplateProps> = ({ data, color, name, lineThickness }) => {
  const chartContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const chartTitleStyle = {
    textAlign: 'center',
    fontSize: '20px',
    marginBottom: '10px',
    color: 'steelblue',
  };

  const chartStyle = {
    width: '100%',
    height: '300px',
  };

  const chartSvgStyle = {
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    }}>
      <h3 style={{
        textAlign: 'center',
        fontSize: '20px',
        marginBottom: '10px',
        color: 'steelblue',
      }}>{name}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} style={chartStyle}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#555555' }} />
          <YAxis tick={{ fill: '#555555' }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Task"
            stroke="#8884d8"
            strokeWidth={lineThickness}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Task Done"
            stroke="#82ca9d"
            strokeWidth={lineThickness}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartTemplate;
