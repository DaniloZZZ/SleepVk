
import React,{Component} from 'react';
import TimePicker from 'react-toolbox/lib/time_picker/TimePicker'
export default class TimePickerPad extends Component{
    constructor(){
        super()
        this.slideIn=this.slideIn.bind(this)
    }
    state = {
        time1:new Date(),
        time2:new Date(),
        closed:true,
        active:false,
        classes:{root:'root',padh:'padh',pad:'pad'}
    };
    toggleClass(classname){
        var suffix = "open"
        if (this.state.closed) {
            return [classname, [classname, suffix].join('-')].join(' ')
        } else {
            return classname.split(' ')[0]
        }
    }

    slideIn(){
        var keys = Object.keys(this.state.classes)
        var cls = {}
        keys.forEach(k=>{
            cls[k]=this.toggleClass(this.state.classes[k])
        })
        
        this.setState({...this.state,
            closed:!this.state.closed,
            classes:cls
        })
    } 

    handleChange = (item, value) => {
        //this.props.handler(item,value)
        this.setState({ ...this.state, [item]: value });
    };

    chooserS={
        width:'30px',
        height:'60px',
        position:'absolute',
    }
    pickS={
        margin:'4px 8px',
        width:'50px',
        float:'left',
    }
    iconhS={
        width:'50px',
        height:'50px',

    }
    padS={
        padding:'4px'
    }

    render () {

        return(
            <div className={this.state.classes.root}>
                <div style={this.chooserS}>
                    <div style={this.iconhS} onClick={this.slideIn}>
                        <img className="icon" src="https://d30y9cdsu7xlg0.cloudfront.net/png/17392-200.png"></img>
                    </div>
                </div>
                <div className={this.state.classes.padh}>
                    <div className={this.state.classes.pad} style={this.padS}>
                        <div style={this.pickS}>
                        <TimePicker label={'From'} onChange={this.handleChange.bind('time2')} value={this.state.time1} />
                        </div>
                        <div style={this.pickS}>
                        <TimePicker active={this.state.active} onclick={()=>{this.setState({...this.state,active:true})}}label={'To'} onChange={this.handleChange.bind('time2')} value={this.state.time2} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
  /*
Animate.extend(class TimePicker extends React.Component{
    chooserS={
        position:'absolute',
        float:'right',
        width:'30px',
        height:'60px',
        transition:'0.2s'
    }

    iconS={
        width:'30px',
        height:'30px',
        backgroundColor:"#fadddd"
    }
    render(){
        return(
            <div style={Animate.getAnimatedStyle.call(this,'slide-in')}>
                <div style={this.state.chooserS}>
                    <div style={this.iconS} onClick={this.slideIn}>
                        <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/17392-200.png"></img>
                    </div>   

                </div>
            </div>
        )
    }
})
*/