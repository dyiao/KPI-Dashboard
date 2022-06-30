import React from "react";
import { PieChart, Pie, Cell, Legend, LabelList } from "recharts";



const CategoryMLPerformance = () => {

    const data = [
        {
            Category: 0,
            Upsets: [
                { name: "Predicted Upset", value: 1 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 3 },
            ]
        }, {
            Category: 1,
            Upsets: [
                { name: "Predicted Upset", value: 3 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 2,
            Upsets: [
                { name: "Predicted Upset", value: 2 },
                { name: "Only Warning", value: 3 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 3,
            Upsets: [
                { name: "Predicted Upset", value: 5 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 4,
            Upsets: [
                { name: "Predicted Upset", value: 0 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 5,
            Upsets: [
                { name: "Predicted Upset", value: 3 },
                { name: "Only Warning", value: 0 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 6,
            Upsets: [
                { name: "Predicted Upset", value: 3 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 7,
            Upsets: [
                { name: "Predicted Upset", value: 1 },
                { name: "Only Warning", value: 1 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 8,
            Upsets: [
                { name: "Predicted Upset", value: 3 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 9,
            Upsets: [
                { name: "Predicted Upset", value: 10 },
                { name: "Only Warning", value: 7 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 10,
            Upsets: [
                { name: "Predicted Upset", value: 16 },
                { name: "Only Warning", value: 100 },
                { name: "Only Upset", value: 1 },
            ]
        }, {
            Category: 11,
            Upsets: [
                { name: "Predicted Upset", value: 0 },
                { name: "Only Warning", value: 0 },
                { name: "Only Upset", value: 0 },
            ]
        }, {
            Category: 12,
            Upsets: [
                { name: "Predicted Upset", value: 2 },
                { name: "Only Warning", value: 2 },
                { name: "Only Upset", value: 2 },
            ]
        }, {
            Category: 13,
            Upsets: [
                { name: "Predicted Upset", value: 9 },
                { name: "Only Warning", value: 6 },
                { name: "Only Upset", value: 3 },
            ]
        }
    ];

    const xInit = 75;
    const yInit = 100;
    const xIncr = 135;
    const yIncr = 125;

    const COLORS = ["#00AA00", "#0000FF", "#5500FF"];

    let upsetSum = (upsets) => {
        let sum = 0;
        for (let index of upsets) {
            sum += index.value;
        }
        return sum;
    }

    return (
        <PieChart width={1000} height={325}>
            <text x={10}
                y={40}
                textAnchor="left"
                fill={"#FFFFFF"}
                fontSize={20}>
                Overall Category ML Performance (Feb 2022)
            </text>
            {data.map((categories, index) => (
                <>
                    <Pie
                        data={categories.Upsets}
                        cx={categories.Category > 6 ? xInit + xIncr * (categories.Category - 7) : xInit + xIncr * categories.Category}
                        cy={categories.Category > 6 ? yInit + yIncr : yInit}
                        innerRadius={35}
                        outerRadius={45}
                        fill="#8884d8"

                        dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <LabelList datakey="value" position="outside" offset={6} fontSize={10} />
                    </Pie>
                    <text x={categories.Category > 6 ? xInit + xIncr * (categories.Category - 7) + 5 : xInit + xIncr * categories.Category + 5}
                        y={categories.Category > 6 ? yInit + yIncr + 20 : yInit + 20}
                        dy={8} textAnchor="middle"
                        fill={"#FFFFFF"}
                        fontSize={12}>
                        Category {categories.Category}
                    </text>
                    <text x={categories.Category > 6 ? xInit + xIncr * (categories.Category - 7) + 5 : xInit + xIncr * categories.Category + 5}
                        y={categories.Category > 6 ? yInit + yIncr + 35 : yInit + 35}
                        dy={8} textAnchor="middle"
                        fill={"#FFFFFF"}
                        fontSize={10}>
                        {upsetSum(categories.Upsets)} Upsets
                    </text>
                </>
            ))}
            <Legend
                payload={[
                    { value: 'Predicted Upset', type: 'square', color: '#00AA00' },
                    { value: 'Only Warning', type: 'square', color: '#0000FF' },
                    { value: 'Only Upset', type: 'square', color: '#5500FF' }
                ]}
                iconSize={20} verticalAlign='top' align='right'
            />
        </PieChart>
    );
}

export default CategoryMLPerformance;