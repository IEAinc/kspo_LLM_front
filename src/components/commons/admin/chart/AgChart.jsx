import React, { useEffect, useState } from 'react';
import { AgCharts } from 'ag-charts-react'

const AgChart = ({
                     data,series,title,legendOptions = {enabled:false},additionalOptions = {}
                 }) => {
    useEffect(()=>{
        setChartOptions(
            {
                data,
                // 제목 설정
                title: title ? {
                    text: title,
                    fontSize: 16,
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    color: "#333333",
                    ...typeof title === 'object' ? title : {}
                } : undefined,
                legend: {
                    enabled: false,
                    position: "top", // 범례를 위쪽에 배치
                    spacing: 10,
                    itemSpacing: 20, // 범례 아이템 간 간격
                    alignment: "start",
                    ...legendOptions
                },

                // 시리즈 설정
                series,
                // 추가 설정 병합
                ...additionalOptions
            }

        )
    },[data,series,title,legendOptions,additionalOptions])
    const [chartOptions, setChartOptions] = useState({
        data,
        // 제목 설정
        title: title ? {
            text: title,
            fontSize: 16,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            color: "#333333",
            ...typeof title === 'object' ? title : {}
        } : undefined,
        legend: {
            enabled: false,
            position: "top", // 범례를 위쪽에 배치
            spacing: 10,
            itemSpacing: 20, // 범례 아이템 간 간격
            alignment: "start",
            ...legendOptions
        },

        // 시리즈 설정
        series,
        // 추가 설정 병합
        ...additionalOptions
    });

    return <AgCharts options={chartOptions}  style={{ height: '220px' }} />;
};

export default AgChart;