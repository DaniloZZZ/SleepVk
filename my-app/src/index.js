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
Data.loadUsers().then(()=>{
    console.log("index: DataLoaded, rendering ...")
    render();
    console.log("index: rendered. Initing Stats of Provider")
    Data.initStats()
})
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

var mainS={
    margin:'0px 32px 0px 0px'
}
function render(){
ReactDOM.render(
    <ThemeProvider theme={theme}>
        <div style={mainS} className="main">
        <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
        <SideBar onUserPicked={updateStats} data={Data}/>
        </div>
        <div className="col-lg-9 col-md-8 col-sm-6">
            <StatsPad user={user_picked}/>
            </div>
        </div>
        </div>
    </ThemeProvider>
    
, document.getElementById('root'));}
registerServiceWorker();

function updateStats(user){
    user_picked = user;
    console.log("index:U1 updating new user:",user_picked)
    render();
}
