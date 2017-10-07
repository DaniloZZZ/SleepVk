const log4js = require('log4js');
log4js.configure({
    appenders: {
        file: { type: 'file', filename: 'sleepVk.log' },
        debug_file:{type:'file',filename:'debug.log'},
        console: { type: 'stdout' }
    },
    categories: {
        default: { appenders: ['file','console'], level: 'info' },
        debug: { appenders: ['console','debug_file'],level:'trace'}
    }
});

const gLg=log4js.getLogger

module.exports={
    worker:log4js.getLogger('worker'),
    server:log4js.getLogger('server'),
    db:log4js.getLogger('db'),
    frontend:log4js.getLogger('forntend'),
    path:function(){console.log(require('path').resolve())},

    debug:{
        worker:gLg('debug.worker'),
        server:gLg('debug.server'),
        db:gLg('debug.db'),
        frontend:gLg('debug.frontend')
    }
};