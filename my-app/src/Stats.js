import React from 'react';
import ChartCard from './elements/ChartCard.js'
import DataProvider from './Data.js'

export default class StatsPad extends React.Component{
    constructor(props){
        super()
        this.test = "HALT"+props.user.first_name
    }


    render(){
        return(
            <div>
                <ChartCard 
                user={this.props.user} 
                dataProvider = {new DataProvider([0,0,0,18,0])}
               />
                <ChartCard 
                user = {this.props.user}
                dataProvider={new DataProvider([0,0,3,0,0])}
                />
            </div>
        );
    }
}
