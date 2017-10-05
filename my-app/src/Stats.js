import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { LineChart,Line, Lconst ,XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer} from 'recharts';
import  CardTitle  from 'react-toolbox/lib/card/CardTitle';
import Button from 'react-toolbox/lib/button/Button';

export default class StatsPad extends React.Component{
    constructor(props){
        super()
        this.Data = props.data;
        
        console.log(this.Data);
        if(props.data.records!=undefined){
        this.chartRow = this.convertData(props.user,props.data.records)
        this.data_aval =true;
        }else{
            this.data_aval = false;
        }
        this.test = "HALT"+props.user.first_name
    }

    MINUTES_BETWEEN=5
    testf(){
        return this.props.user.first_name+"FUNC"
    }
    convertData(u,d){
        var id = u.id
        if (id != undefined) {
            this.data_aval=true
            return d.map((r) => {
                let user = r.records.filter(usr => usr.id == id)[0]
                return {
                    date: r.date,
                    online: user.online
                }
            })
        } else {
            this.data_aval = false;
        }
    }

    accumData(u,d){
        var raw  =this.convertData(u,d);
        var res = []
        var now = new Date()
        for (var h=0;h<23;h++){
            var date1 = now.setHours(h);
            var date2 = now.setHours(h+1);
            var in_hour = raw.filter(r=>{
                var date = new Date(r.date).getTime()
                return (date>=date1&&date<date2)
            })
            var sum = 0
            in_hour.forEach((stat)=>{
                sum+=stat.online * this.MINUTES_BETWEEN
            });
            res.push({
                date:new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,),
                online:sum
            })
        }
        return res
    }

    render(){
        return(
            <div>
                <ChartCard 
                user={this.props.user} 
                data={this.accumData(this.props.user,this.props.data.records)}  />
            </div>
        );
    }
}

class ChartCard extends Component {
    constructor(props){
        super()
    }
    convertDates(){
        var options = {
            hour: 'numeric',
            minute: 'numeric',
        };

        return this.props.data.map(r => {
            return {
                date: r.date.toLocaleString("ru-ru", options),
                online: r.online
            }
        })
    }
    style ={
        width:'auto',
        margin:'10px',
        backgroundColor:'#fafafa',
        padding:'10px',
        boxShadow:' 0px 0px 34px -4px rgba(0,0,0,0.17)'
    }
    render(){
        var content = <p>No data</p>
        if(this.props.data!=undefined){
            content = (
                <LineChart width={600} height={300} 
                data={this.convertDates()}
                 margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="online" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            )
        }
        return(
            <div className="graph" style={this.style}>
                <CardTitle 
                avatar={this.props.user.photo_100}
                title="Chart by time"/>

               {content}
            </div>
        );
    }
}
