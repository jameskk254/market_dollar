import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 4,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 8,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 0,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 9,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4,
        amt: 2100,
    },
];

export default class ApolloLineChart extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart width={300} height={100} data={data}>
                    <Line
                        type='monotone'
                        dataKey='pv'
                        stroke='#8884d8'
                        strokeWidth={2}
                        dot={props => {
                            const { cx, cy, value } = props;
                            return (
                                <g>
                                    <circle cx={cx} cy={cy} r={4} fill='#8884d8' />
                                    <text x={cx} y={cy} dy={-10} textAnchor='middle' fill='#8884d8'>
                                        {value}
                                    </text>
                                </g>
                            );
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
