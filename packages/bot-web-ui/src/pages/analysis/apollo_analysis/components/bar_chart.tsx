import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const data = [
    {
        name: 'Rise',
        uv: 58,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Fall',
        uv: 42,
        pv: 1398,
        amt: 2210,
    },
];

const renderCustomizedLabel = props => {
    const { x, y, width, value } = props;
    return (
        <text x={x + width + 5} y={y + 10} fill='#666' textAnchor='start' fontSize={12}>
            {value}
        </text>
    );
};

export default class ApolloBarChart extends PureComponent {

    render() {
        return (
            <ResponsiveContainer width='140%' height={211}>
                <BarChart
                    width={100}
                    height={211}
                    data={data}
                    layout='vertical'
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis type="number" label="" />
                    <YAxis type='category' dataKey='name' />
                    <Tooltip />
                    <Bar dataKey='uv' fill='#8884d8'>
                        <LabelList dataKey='uv' content={renderCustomizedLabel} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
