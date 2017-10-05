import  CardTitle  from 'react-toolbox/lib/card/CardTitle';
import Button from 'react-toolbox/lib/button/Button';
import { LineChart,Line, Lconst ,XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer} from 'recharts';
import React,{Component} from 'react';

export default class ChartCard extends Component {
    constructor(props){
        super()
        this.provider = props.dataProvider
        this.user = props.user
        props.dataProvider.load.then((stats)=>{
            console.log("user from chcd constructor",props.user)
            this.setState({ 
                data: props.dataProvider.getUserRecords(props.user)
             })
        })
    }

    state= {
        data:undefined
    }

    getData(){
        var options = {
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        console.log("U3 Calling getUsrRecs for user",this.props.user)
        return this.provider.getUserRecords(this.props.user).map(r => {
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
        console.log("U2 data in Chart Card",this.state.data)
        try {
            console.log("user in ChartCard provider", this.provider.Stats.user_id)
        }
        catch (err) { console.error(err) }
        if(this.state.data!=undefined){
            content = (
                <LineChart width={600} height={300} 
                data={this.getData()}
                 margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="online" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            )
        }else{
            console.error("Got wrong data type",this.state.data)
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