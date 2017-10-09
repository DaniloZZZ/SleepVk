import  CardTitle  from 'react-toolbox/lib/card/';
import DatePicker from 'react-toolbox/lib/date_picker/'
import Avatar from 'react-toolbox/lib/avatar/'
//import Button from 'react-toolbox/lib/button/Button';
import {Bar,BarChart, LineChart,Line, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer} from 'recharts';
import React,{Component} from 'react';
import Vue from 'vue'
import TimePickerPad from './TimePicker.js'
import * as S from './ChartCardStyle.js' 
import ScrollStat from './Scroll.js'
import Testa from './test.coffee'
//import Testa from 'coffee-loader!./test.coffee';

export default class ChartCard extends Component {
    constructor(props){

        console.log("styles",S)
        super()
        this.provider = props.dataProvider
        this.user = props.user
        this.dateChangeHandler= this.dateChangeHandler.bind(this)
        this.timeChangeHandler= this.timeChangeHandler.bind(this)
        console.log("Constuctor of ChartCard is loading data...")
        this.provider.loadRecords().then(()=>{
            this.dataLoaded = true
            console.log("ChartCard loaded data. Hooray!")
            this.setState({ 
                fromDate: props.dataProvider.lower,
                toDate: props.dataProvider.upper,
                data: this.provider.getUserRecords(props.user)
             })
        })
    }

    title = "Online time"
    state= {
        data:undefined
    }

    dateChangeHandler(item,value) {
        if(item==='from'){
            let tim = new Date(this.state.fromDate.setMonth(value.getMonth()))
            tim = new Date(tim.setDate(value.getDate()))
            tim = new Date(tim.setFullYear(value.getFullYear()))

            this.provider.lower = tim
            let newData = this.provider.getUserRecords(this.user)
            this.setState({...this.state,data:newData,fromDate:tim})
        }
        if(item==='to'){
            let tim = new Date(this.state.toDate.setMonth(value.getMonth()))
            tim = new Date(tim.setDate(value.getDate()))
            this.provider.upper = tim
            let newData = this.provider.getUserRecords(this.user)
            this.setState({...this.state,data:newData,toDate:tim})
        }
        
    }

    timeChangeHandler(item,value){
        if(item==='from'){
            let tim = new Date(this.state.fromDate.setHours(value.getHours()))
            tim = new Date(tim.setMinutes(value.getMinutes()))
            this.provider.lower = tim
            let newData = this.provider.getUserRecords(this.user)
            this.setState({...this.state,data:newData,fromDate:tim})
        }
        if(item==='to'){
            let tim = new Date(this.state.toDate.setHours(value.getHours()))
            tim = new Date(tim.setMinutes(value.getMinutes()))
            this.provider.upper = tim
            let newData = this.provider.getUserRecords(this.user)
            this.setState({...this.state,data:newData,toDate:tim})
        }
        console.log('time',this.state.fromDate,this.state.toDate, item, value)
    }

    getSpan(){
        try {
        let ord = this.provider.Stats.best_order
        let base = this.provider.Stats.ordersBase
        let names = Object.keys(base)
        let ending = "s"
        if(ord.rank===1){
            ending = ""
        }
        return ord.rank+" "+names[ord.type]+ending
    }
    catch  (err){
        return ""
    }
    }
    getTitle(){
        let sp = this.getSpan()
        if(this.dataLoaded){
            return this.title + " "
        }
        else {
            return "Loading data..."
        }
    }


    getData(){
        var timeopt = {
            hour: 'numeric',
            minute: 'numeric',
        };
        var dateopt={
            weekday: 'short',
        }
        console.log("Calling getUsrRecs for user",this.props.user)
        return this.provider.getUserRecords(this.props.user).map(r => {
            let datetme={
                time: r.date.toLocaleString("ru-ru",timeopt),
                date:r.date.toLocaleString("ru-ru",dateopt)
            }
            return {
                date:(datetme.time+", "+datetme.date),
                online: r.online
            }
        })
    }

    style ={
        width:'auto',
        margin:'10px',
        maxWidth:'500px',
        backgroundColor:'#fafafa',
        padding:'10px',
        position:'relative',
        boxShadow:' 0px 0px 34px -4px rgba(0,0,0,0.17)'
    }
    render(){
        let data = this.getData()
        console.log("Rendering Chart Card")
        var graph = <p style={S.noDataS}>No data for this period</p>
        if (this.dataLoaded) {
            console.log("U2 data in Chart Card", this.state.data)
            console.log("user in ChartCard provider", this.provider.Stats.user_id)
        } else {
            console.warn("trying to render when theres no data yet!")
        }
        if (data.length >0) {
            graph = (
                <ResponsiveContainer width="100%" aspect={1.818} minHeight={100}>
                <LineChart width={600} height={300} 
                data={data}>
                    <Line type="monotone" dataKey="online" fill="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
                </ResponsiveContainer>
            )
        }else{
            console.error("Got wrong data type",data)
        }

        return(
            <div className="graph" style={this.style}>
                <div style={S.topS}>
                    <div style={S.avatarS}><Avatar >
                        <img src={this.props.user.photo_100} />
                    </Avatar></div>
                    <span style={S.titleS}>{this.getTitle()}</span>
                    <div style={S.pickerS}>
                        <DatesPicker
                        handler={this.dateChangeHandler}
                        from={this.state.fromDate}
                        to={this.state.toDate}
                     /></div>
                </div>
                <div style={S.contentStyle}>
                    <span style={S.descStyle}>{"minutes of online time during " + this.getSpan()}</span>
                    <div style={{marginLeft:'-28px'}}>{graph}</div>
               </div>
                <TimePickerPad onChange={this.timeChangeHandler}/>
            </div>
        );
    }
}


class DatesPicker extends React.Component {
    constructor(props){
        super()
        this.props = props
        this.state = {
            from: this.props.from,
            to: this.props.to
        }
    }

    handleChange = (item, value) => {
        this.props.handler(item,value)
        this.setState({ ...this.state, [item]: value });
    };

    formatFunc(val){
        var options = {
            year:'2-digit',
            month: 'short',
            day: '2-digit',
        };
        return val.toLocaleString("ru-ru", options)
    }

    pickerStyle = {
        float: 'left',
        width: '90px',
        margin: '8px 12px',
        marginTop: '-8px'
    }

    render() {
        return (
            <div>
                <div style={this.pickerStyle}>
                    <DatePicker
                        label='From'
                        autoOk={true}
                        inputFormat={this.formatFunc}
                        onChange={this.handleChange.bind(this, 'from')}
                        value={this.props.from}
                    />
                </div>
                <div style={this.pickerStyle}>
                    <DatePicker
                        label='To'
                        autoOk={true}
                        inputFormat={this.formatFunc}
                        onChange={this.handleChange.bind(this, 'to')}
                        value={this.props.to}
                    />
                </div>
            </div>
        );
    }
}