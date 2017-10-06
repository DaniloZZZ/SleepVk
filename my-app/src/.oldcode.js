
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