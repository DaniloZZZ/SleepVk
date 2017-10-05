import React,{Component} from 'react';
import ChartCard from './elements/ChartCard.js'
import DataProvider from './Data.js'

export default class StatsPad extends React.Component{
    constructor(props){
        super()
        this.Data = props.data;
        this.test = "HALT"+props.user.first_name
    }

    weekProvider = new DataProvider([0,0,7,0,0])
    dayProvider = new DataProvider([0,0,1,0,0])

    render(){
        return(
            <div>
                <ChartCard 
                user={this.props.user} 
                dataProvider = {this.dayProvider}
               />
                <ChartCard 
                user = {this.props.user}
                dataProvider={new DataProvider([0,0,7,0,0])}
                />
            </div>
        );
    }
}
