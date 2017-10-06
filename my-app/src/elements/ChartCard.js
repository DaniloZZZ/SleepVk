import  CardTitle  from 'react-toolbox/lib/card/CardTitle';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import Avatar from 'react-toolbox/lib/avatar/Avatar'
//import Button from 'react-toolbox/lib/button/Button';
import { LineChart,Line, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer} from 'recharts';
import React,{Component} from 'react';
import classnames from 'classnames';
import useSheet from 'react-jss';

export default class ChartCard extends Component {
    constructor(props){
        super()
        this.provider = props.dataProvider
        this.user = props.user
        this.dateChangeHandler= this.dateChangeHandler.bind(this)
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
            this.provider.lower = value
            let newData = this.provider.getUserRecords(this.user)
            this.setState({...this.state,data:newData,fromDate:value})
        }
        if(item==='to'){
            this.provider.upper = value
            let newData = this.provider.getUserRecords(this.user)
            this.setState({...this.state,data:newData,toDate:value})
        }
        
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
        var options = {
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
        };
        console.log("Calling getUsrRecs for user",this.props.user)
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
        maxWidth:'500px',
        backgroundColor:'#fafafa',
        padding:'10px',
        boxShadow:' 0px 0px 34px -4px rgba(0,0,0,0.17)'
    }
    descStyle={
        color:'#888',
        fontSize:'8',
        marginLeft:'32px'
    }
    contentStyle={
        margin:'5px'
    }

    pickerS={
        height:'80%',
        float:'left',
        margin:'4px 8px',
        marginLeft:'32px'
    }

    topS={
        width:'100%',
        height:'60px',
        margin:'10px'
    }
    titleS={
        float:'left',
        fontSize:'24px',
        margin:'8px',
        marginTop:'16px'
    }
    avatarS={
        float:'left',
        margin:'14px'
    }

    render(){
        console.log("Rendering Chart Card")
        var graph = <p style={{margin:'20px'}}>No data</p>
        if (this.dataLoaded) {
            console.log("U2 data in Chart Card", this.state.data)
            console.log("user in ChartCard provider", this.provider.Stats.user_id)
        } else {
            console.warn("trying to render when theres no data yet!")
        }
        if (this.state.data !== undefined) {
            graph = (
                <ResponsiveContainer width="100%" aspect={1.818} minHeight={100}>
                <LineChart width={600} height={300} 
                data={this.getData()}>
                    <Line type="monotone" dataKey="online" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
                </ResponsiveContainer>
            )
        }else{
            console.error("Got wrong data type",this.state.data)
        }

        return(
            <div className="graph" style={this.style}>
                <div style={this.topS}>
                    <div style={this.avatarS}><Avatar >
                        <img src={this.props.user.photo_100} />
                    </Avatar></div>
                    <span style={this.titleS}>{this.getTitle()}</span>
                    <div style={this.pickerS}><DatesPicker 
                    handler={this.dateChangeHandler}
                    from={this.state.fromDate}
                    to = {this.state.toDate}
                     /></div>
                </div>
                <div style={this.contentStyle}>
                    <span style={this.descStyle}>{"minutes of online time during " + this.getSpan()}</span>
                    <div style={{marginLeft:'-28px'}}>{graph}</div>
               </div>
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
        console.log("picker stae:",this.state,"picker props:",this.props)
        return (
            <div>
                <div style={this.pickerStyle}>
                    <DatePicker
                        label='From'
                        autoOk={true}
                        inputFormat={this.formatFunc}
                        onChange={this.handleChange.bind(this, 'from')}
                        value={this.props.from}
                        mondayFirstDayOfWeek
                    />
                </div>
                <div style={this.pickerStyle}>
                    <DatePicker
                        label='To'
                        autoOk={true}
                        inputFormat={this.formatFunc}
                        onChange={this.handleChange.bind(this, 'to')}
                        value={this.props.to}
                        mondayFirstDayOfWeek
                    />
                </div>
            </div>
        );
    }
}