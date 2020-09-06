import React from 'react';
import './BookingChart.css';
import {Bar as BarChart} from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
        max: 10000000
    }
};

const bookingChart = props => {

    const chartData = {labels: [], datasets: []};//refer to react-chartjs/bar.js

    let values = [];

    for (const bucket in BOOKINGS_BUCKETS){

        const filterdBookingsCount = props.bookings.reduce((prev, current)=>{

            if (current.event.price > BOOKINGS_BUCKETS[bucket].min
             && current.event.price < BOOKINGS_BUCKETS[bucket].max){
                return prev + 1;
            }else{
                return prev;
            }
        }, 0);

        values.push(filterdBookingsCount);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            //label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: values//[filterdBookingsCount]
        });

        console.log(values);

        values = [...values];       //ex:[1,2,3]
        values[values.length-1] = 0;//ex:[0,0,0]
    }

    // chartData.datasets.push({
    //     //label: 'My First dataset',
    //     backgroundColor: 'rgba(255,99,132,0.2)',
    //     borderColor: 'rgba(255,99,132,1)',
    //     borderWidth: 1,
    //     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    //     hoverBorderColor: 'rgba(255,99,132,1)',
    //     data: values//[filterdBookingsCount]
    // });

    return  (
        <div style={{textAlign:'center'}}>
            <BarChart data={chartData} />
        </div>
    );
};

export default bookingChart;