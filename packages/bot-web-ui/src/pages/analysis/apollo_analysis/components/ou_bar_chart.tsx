import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
        <text x={x + width + 5} y={y + 10} fill='#666' textAnchor='start' fontSize={12}>
            {value}
        </text>
    );
};

const calculatePercentage = (arr: Number[], over: Number, under: Number) => {
    const totalCount = arr.length;
    const overCount = arr.filter(item => item > over).length;
    const underCount = arr.filter(item => item < under).length;

    const overPercentage = (overCount / totalCount) * 100;
    const underPercentage = (underCount / totalCount) * 100;

    return [overPercentage, underPercentage];
};

interface OverUnderProps {
    overUnderList: Number[];
    overValue: number|string;
    underValue: number|string;
    is_mobile: boolean;
}

export default class OverUnderBarChart extends PureComponent<OverUnderProps> {
    render() {
        const { overUnderList, overValue, underValue, is_mobile } = this.props;
        const [overPercentage, underPercentage] = calculatePercentage(overUnderList, Number(overValue), Number(underValue));
        const data = [
            {
                name: `Over`,
                percentage: +overPercentage.toFixed(2),
            },
            {
                name: `Under`,
                percentage: +underPercentage.toFixed(2),
            },
        ];

        const barColors = ['#4CAF50', '#F44336'];

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
                    <XAxis type='number' label='' />
                    <YAxis type='category' dataKey='name' />
                    <Tooltip />
                    <Bar dataKey='percentage' fill='#8884d8' isAnimationActive={!is_mobile}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index]} />
                        ))}
                        <LabelList dataKey='percentage' content={renderCustomizedLabel} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
