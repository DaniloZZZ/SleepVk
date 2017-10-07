
// Used for accumulating data. preplaced with StatsExtracor
    accumData(u,d){
        var raw  =this.convertData(u,d);
        var res = []
        var now = new Date()
        for (var h=0;h<23;h++){
            var date1 = now.setHours(h);
            var date2 = now.setHours(h+1);
            var in_hour = raw.filter(r=>{
                var date = new Date(r.date).getTime()
                return (date>=date1&&date<date2)
            })
            var sum = 0
            in_hour.forEach((stat)=>{
                sum+=stat.online * this.MINUTES_BETWEEN
            });
            res.push({
                date:new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,),
                online:sum
            })
        }
        return res
    }
class CustomizedAxisTick extends Component {
   /* render () {
      const {x, y, stroke, payload} = this.props;
          
      var valObj = JSON.parse(payload.value)
      console.log('payl',payload)
      return (
          <g transform={`translate(${x},${y})`}>
              <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-10)">{valObj.time}
                  </text>
          </g>
      );
    }*/
    render () {
        const {x, y, stroke, payload} = this.props;
            
           return (
            <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
          </g>
        );
      }
}



function handleData(){
    saveData(data)
    keys = Object.keys(data);
/*

    var MINUTES_BETWEEN = 5
    var now = new Date()
    var numberOfRecs = 60 / MINUTES_BETWEEN;
    keys.forEach(k => {
        data_h[k] = []
        date = new Date(now.getFullYear(), now.getMonth(), now.getMonth(), now.getHours()+1)
        console.log(date)
        recs = Math.floor(now.getMinutes()/MINUTES_BETWEEN)
        console.log("recs",recs)
        data_h[k].push({
            date:date,
            "online":sum(data[k].slice(-recs))*MINUTES_BETWEEN
        })
        for (h = 0; h < 24-now.getHours(); h++) {
            mins_online = 0;
            date = new Date(now.getFullYear(), now.getMonth(), now.getMonth(), now.getHours()-h)
            
            recs_hour = data[k].slice((-h-1)*numberOfRecs-recs,-h*numberOfRecs-recs) 
            mins_online = sum(recs_hour) * MINUTES_BETWEEN
            data_h[k].push({
                date: date,
                "online": mins_online
            })
            //console.log("mins",mins_online,"date",date,"sliced",recs_hour,(-h-1)-recs,-h-recs)
        }
    })*/
    console.log("data",data)
}

function appendData(data) {
    try {
        var old = JSON.parse(fs.readFileSync('./data.json'))
        keys = Object.keys(old)

        keys.forEach((k) => {
            old[k] = old[k].concat(data[k])
        })
        saveData(old)
    }
    catch (err) {
        console.log("error opening", err);
        console.log("overwriring data")
        saveData(data)
    }
}
function sum(arr){
    if(arr.length==0){
        return  0;
    }else{
        return arr.reduce((a,b)=>a+b)
    }
}

function loadData(){
    try{
    const now  = new Date()
    const fileName = now.getMonth()+"m-"+now.getDate()+"d" + ".json"
    return JSON.parse(fs.readFileSync('./data/raw/'+fileName))
    }
    catch (err){
        console.log(err)
        return [];
    }
}

function saveData(data) {
    keys = Object.keys(data)
    const now  = new Date()
    const fileName = now.getMonth()+"m-"+now.getDate()+"d" + ".json"
    console.log("writing data to file" + fileName + ". length", data.length)
    fs.writeFileSync('./data/raw/'+fileName, JSON.stringify(data))
}
