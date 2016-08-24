var fuckword = require('../index');

var opt = {
    configDir   :   __dirname+'/config/',
    init        :   false
}

var fuckWordModel = new fuckword(opt);

var res = fuckWordModel.checkNameIllegal('毛主席');
console.log(res);