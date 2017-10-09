
add = function () {
    console.log("adding ...")
    let col = '#' +
        (Math.random() * 0xFFFFFF << 0).toString(16)
    vue.parts.push({
        num: idx,
        style: {
            width: vue.wid + 'px',
            backgroundColor: col,

        }
    })
    idx++
}

idx = 2;
vue = new Vue({
    el: '#app',
    data: {
        wid: 20,
        scrl: 0,
        parts: [],
        message: 'Hello Vue.js!',
    },
    methods: {
        hadl: function (e) {
            this.scrl = e.srcElement.scrollLeft

            if (this.scrl < 200) {
                addpop(e.srcElement)
                e.srcElement.scrollLeft = 200 + 10 * this.wid
            }
        }
    }
})

addpop = function (e) {

    add10()

    pop10()

}
pop10 = function () {
    vue.parts = vue.parts.slice(10)
}
add10 = function () {
    for (let i = 0; i < 10; i++) {
        add()
    }
}
for (let i = 0; i < 30; i++) {
    add()
    }