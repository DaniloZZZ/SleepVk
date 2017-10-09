
import React,{Component} from 'react';
import S from './TimePicker.css'
import TimePicker from 'react-toolbox/lib/time_picker/'
export default class TimePickerPad extends Component{
    constructor(props){
        super()
        this.slideIn=this.slideIn.bind(this)
    }
    state = {
        from: new Date(),
        to: new Date(),
        open:false,
        active: false,
        classes: {
            root:S.root,
            padh:S.padh,
            pad:S.pad,
        }
    };
    toggleClass(classname) {
        if (!this.state.open) {
            return [classname,  ].join(' ')
        } else {
            return classname.split(' ')[0]
        }
    }

    slideIn(){
        var keys = Object.keys(this.state.classes)
        var cls = {}
        keys.forEach(k=>{
            cls[k] = this.state.open ? S[k]+' '+S[k+'-open'] : S[k]
        })
        
        this.setState({...this.state,
            open:!this.state.open,
            classes:cls
        })
    } 

    handleChange = (item, value) => {
        this.props.onChange(item,value)
        this.setState({ ...this.state, [item]: value });
    };

    getClassName(key){
        let c =  S[key]
        if (this.state.open)
            return c +" "+S[key + "Open"]
        else
            return c
    }

    chooserS={
        width:'30px',
        height:'60px',
        position:'absolute',
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
                <div className={S.chooser}>
                    <div className={S.icon} onClick={this.slideIn}>
                        <img className={S.img} src="https://d30y9cdsu7xlg0.cloudfront.net/png/17392-200.png"></img>
                    </div>
                </div>
                <div className={this.state.classes.padh}>
                    <div className={this.state.classes.pad} style={this.padS}>
                        <div className={S.pick}>
                        <TimePicker label={'From'} onChange={this.handleChange.bind(this,'from')} value={this.state.from} />
                        </div>
                        <div className={S.pick}>
                        <TimePicker label={'To'} onChange={this.handleChange.bind(this,'to')} value={this.state.to} />
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