import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import theme from './toolbox/theme.js'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import './toolbox/theme.css'
import SideBar from './App';
import StatsPad from './Stats.js'
import DataProvider from './Data.js'
import registerServiceWorker from './registerServiceWorker';


var Data = new DataProvider()
Data.load.then(()=>{render();Data.initStats()})
var user_picked = {
    "id": 131968259,
    "first_name": "Данил",
    "last_name": "Лыков",
    "city": {
    "id": 628,
    "title": "Запорiжжя"
    },
    "photo_100": "https://sun9-3.us...fe2/a2OABgQFiNw.jpg",
    "verified": 0
    };

function render(){
ReactDOM.render(
    <ThemeProvider theme={theme}>
        <div className="row">
            <div className="col-md-4">
        <SideBar onUserPicked={updateStats} data={Data}/>
        </div>
        <div className="col-lg-8">
            <StatsPad user={user_picked} data={Data}/>
            </div>
        </div>
    </ThemeProvider>
    
, document.getElementById('root'));}
registerServiceWorker();

function updateStats(user){
    user_picked = user;
    console.log("U1 updating",user_picked)
    render();
}
