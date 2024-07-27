var apimodel = require('../app/models/apimodel');
var esp8266controller = require('../app/controllers/iotcontroller');

module.exports = function(app){
    
    app.get('/esp8266/kittinglocs', esp8266controller.api_kittinglocs);

    return app;
};