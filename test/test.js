function testGenerateFile(){
    var fuckword = require('../index');

    var opt = {
        configDir   :   __dirname+'/config/',
        init        :   false
    }

    var fuckWordModel = new fuckword(opt);

    var res = fuckWordModel.checkNameIllegal('毛泽东');
    console.log(res);
}

function generateWordConfig(){

    var fuckWordData = require('../config/forbid.json');
    var _ = require('underscore');

    var configObj = {};

    for(var i = 0; i < fuckWordData.length; i++){

        if(typeof(fuckWordData[i]) == 'object' ){
            var content = fuckWordData[i].forbid;
            var str = "";
            for(var j = 0; j < content.length ;j++){
                var ch = content.charAt(j);
                if(ch == "\\"){
                    ch = '\\\\';
                }
                str+= '["'+ch+'"]';
                if(!eval("configObj"+str)){
                    if(j == content.length - 1){
                        eval("configObj"+str + '= {"fuck":1}') ;
                    } else {
                        eval("configObj"+str + '= {}') ;
                    }
                }
            }
        }
    }

    var str = "exports.fuckwods = " + JSON.stringify(configObj);
    console.log(JSON.stringify(configObj));
    console.log(str)
}


function checkName(name){
    var configObj = require('../lib/wordConfig').fuckwods;
    var str = "configObj";

    for(var i = 0; i < name.length; i++){
        str += '["' + name[i] + '"]';
        var value = eval(str);
        if(!!value){
            if(eval(str+'["fuck"]')){
                console.error('fuck word!!!');
                return true;
            }
        } else {
            return false;
        }
    }
}
var name = '毛泽西';
//console.log(checkName(name));
