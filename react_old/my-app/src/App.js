import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from 'request';

import Dropdown from 'react-toolbox/lib/dropdown/Dropdown';
import Button  from 'react-toolbox/lib/button/Button';
import DataProvider from './Data.js'
//import buttonTheme from 'react-toolbox/lib/button.css';

const PAGE_TITLE = "VK Sleep"

export class ChooseUser extends React.Component {
    constructor(props) {
        super()
        this.users = props.users
        console.log(this.users)
        this.state = {value:1 }
    }
    componentWillMount(){
        var Data = new DataProvider()
    }
    Data = new DataProvider()
    state = { value: 17876798 }
    

    handleChange = (val) => {
        this.setState({ value: val })
        this.props.changedCallback(this.users.filter(u=>u.value==val)[0])
    }

    render() {
        return (
            <Dropdown
                auto
                onChange={this.handleChange}
                source={this.users}
                label='Select user with you want to see'
                template={this.userItem}
                value={this.state.value} />
        )
    };

    userItem(user) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            margin: '2px'
          };

        const contentStyle = {
            display: 'flex',
            margin:'4px',
            marginTop: '20px',
            flexDirection: 'column',
            flexGrow: 2
          };

        const imageStyle = {
            display: 'flex',
            width: '50px',
            height: '50px',
            borderRadius: '25px',
            flexGrow: 0,
            margin: '8px',
            backgroundColor: '#ccc'
        }
        return (
            <div style={containerStyle}>
                <img src={user.photo_100} style={imageStyle} />
                <div style={contentStyle}>
                    <strong>{user.first_name}</strong>
                </div>
            </div>
        );
    }
}

class SideBar extends Component {
  render() {
    return (
      <div className="SideBar">
         <div>
            <h1 className="Title">{PAGE_TITLE}</h1>
            <div className="desc">
                <h3>A simple site to track how u and ur friends sleep</h3>
            </div>
            <Button  label="Hello World!"  />,
            <ChooseUser changedCallback={this.props.onUserPicked} users={this.props.data.users}/>
        </div>
      </div>
    );
  }
}

export default SideBar;
