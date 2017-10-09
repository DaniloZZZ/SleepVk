import React,{Component} from 'react';
import ReactDOM from 'react-dom'
import st from './test.css'

L = React.createElement
console.log ReactDOM
export default class Testa extends Component
    constructor: (props) ->
        super props
        @msg = "coffee!"
    hello = "hello"

    render :->
        console.log @hello, @msg
        L 'div',class:"new",
            L 'p', null , 'Hello!'
            L 'p', null ,@hello
            L 'h1' ,{className:st.new},@msg

