import React,{Component} from 'react';

var idx = 1;
export default class ScrollStat extends Component {
    constructor(props){
        super()
        this.state.parts = []
        this.scrl = 0;
        
        this.hadl = this.hadl.bind(this)
    }
    state = {
        parts:[],
        wid:20,
        divs:[]
    }
    
    componentDidMount(){
        for (let i = 0; i < 30; i++) {
            this.add()
        }
        this.holder.addEventListener('scroll',this.hadl)
    }
    
    scale(){
        this.setState({divs})
    }

    add = function () {
        console.log("adding ...")
        let col = '#' +
            (Math.random() * 0xFFFFFF << 0).toString(16)
        var p = this.state.parts

        let style = {
            height:'200px',
            wordWrap:'break-word',
            width: this.state.wid + 'px',
            backgroundColor: col,
        }
        console.log('state.wid',style)

        p.push (
            <div style={s.part}>
                <div style={style}>
                    {idx}
                </div>
            </div>
        )
        this.setState({divs:p})
        idx++
    }

    hadl = function (e) {
        this.scrl = e.srcElement.scrollLeft
        console.log(this.scrl)
        if (this.scrl < 200) {
            this.addpop(e.srcElement)
           e.srcElement.scrollLeft = 200 + 10 * this.state.wid
        }
    }
    
    addpop(){
        for (let i = 0; i < 10; i++) {
            this.add()
        }
        this.state.parts = this.state.parts.slice(10)
    }

    render() {
        return (
            <div>
            <div style={s.con}>
                <div ref={e=>{this.holder=e}} 
                    style={s.holder}>
                    {this.state.divs}
                </div>
            </div>
            <form onSubmit={this.scale}>
            <input type='text' onChange={e=>{
                console.log(e.target.value)
                this.setState({wid:e.target.value})
                }}
                 value={this.state.wid}/>
            </form>
            <p>{this.scrl}</p>
            </div>
        )
    }
}
var s = {
    "part": {
        "height": "200px"
    },
    "con": {
        "height": "200px",
        "border": "1px solid",
        "width": "200px",
        "overflow": "hidden"
    },
    "holder": {
        "height": "220px",
        "width": "200px",
        "direction": "rtl",
        "overflow": "auto",
        "display": "inline-flex"
    }

}