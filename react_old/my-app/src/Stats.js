import React from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line } from 'recharts';
import { Card,  CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';

export default class StatsPad extends React.Component{
    constructor(props){
        super()
        this.Data = props.data;
        console.log(this.Data);
        this.chartRow = convertData(props.user,props.Data.records)
    }

    convertData(u,d){
        return d.map((r)=>{
            return {
                date:r.date,
                online:r[u].online
            }
        })
    }

    render(){
        return(
            <div>
                <ChartCard user={this.props.user} data={this.chartRow}  />
            </div>
        );
    }
}

class ChartCard extends React.Component {
    constructor(){
        super()
    }
    render(){
        return(
            <Card style={{ width: '350px' }}>
                <CardTitle
                    avatar={this.props.user.photo_100}
                    Title="Chart of online" />
                <LineChart width={600} height={300} data={this.props.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="online" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
                <p>Hello</p>
            </Card>
        );
    }
}
