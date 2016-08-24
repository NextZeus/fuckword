/**
 * Created by lixd on 16/8/22.
 */
var fs = require('fs');
var wordConfig = require(__dirname + '/../lib/wordConfig.js').fuckwods;
var async = require('async');


function fuckword(){

}

fuckword.prototype.generateConfig = function () {
    async.waterfall([
        function (cb) {
            generateForbidJson(cb);
        },
        function () {
            initWordConfig(cb);
        }
    ], function (err) {
        if(!!err){
            throw new Error('Generate Config Error!!!');
        } else {
            console.info('Generate Config Success!!!');
        }
    });
}


/**
 * fuckword2016.txt file contains all fuck words in 2016
 * if you want to generate your config , call this function and init function
 * generate forbid json file by fuckword2016.txt
 */
function generateForbidJson (next) {
    var fuckwords;
    var fuckwordArray;

    fs.readFile(__dirname + '../config/fuckword2016.txt','utf8', function (err,data) {
        if(!err && !!data){
            fuckwords = data;
            fuckwordArray = fuckwords.split('、');
            console.log(fuckwordArray[0],fuckwordArray.length);
            fs.writeFileSync('../config/forbid.json',JSON.stringify(fuckwordArray));
            next();
        } else {
            throw new Error('Generate config file error!!!');
        }
    });
}

//init lib wordConfig.js
function initWordConfig (next){
    var fuckWordData = require(__dirname+'/../config/forbid.json');
    //转换屏蔽词  如 : 毛泽东 毛毛泽东 {毛:{泽:{东:{fuck:1} ,毛:{泽 : 东: {fuck : 1}}}}} appendFile
    var str = '';
    if(!!fuckWordData && fuckWordData.length > 0){
        for(var i = 0; i < fuckWordData.length; i++){
            if(typeof(fuckWordData[i]) == 'object' ){
                var keys = Object.keys(fuckWordData[i]);
                var content = fuckWordData[i][keys[0]];

                var obj = {};
                var count = 0;
                for(var j = 0; j < content.length ;j++){
                    var ch = content.charAt(j);
                    if(ch == "\\"){
                        ch = '\\\\';
                    }
                    str += '"' + ch + '"' + ' : {'
                }
                str += '"fuck" : 1';
                for(var x = 0 ; x < content.length ;x++){
                    str += "}"
                }
                str += ","
            }
        }
        str = str.substring(0,str.length -2);
        str = 'exports.fuckwods = ' + '{' + str + '}}';
        fs.writeFile(__dirname + '/../lib/wordConfig.js',str,null,function(err,info){
            if(!err){
                console.log('屏蔽词库初始化成功');
                next();
            }else{
                console.log('屏蔽词库初始化失败===>>',err);
                throw new Error('Init WordConfig error!!!');
            }
        });
    }
}

/**
 * check name contains fuck word
 * @param name
 * @returns {boolean}
 */
fuckword.prototype.checkNameIllegal = function(name){
    var str = '';
    var keys = [];
    for(var i = 0; i < name.length ; i++){
        var ch = name.charAt(i);
        keys.push(ch);
        var index = '["' + keys.join('"]["') +'"]';
        if(!!eval('wordConfig' + index)){
            for(var j = i + 1 ; j < name.length; j ++ ){
                var ch2 = name.charAt(j);
                keys.push(ch2);
                var index2 = '["' + keys.join('"]["') +'"]';
                if( !!eval(('wordConfig' + index2)) ){ // 能拿到最后的fuck  说明完全匹配了
                    if(!!eval(('wordConfig' + index2 + '["fuck"]'))){
                        return true;
                    }
                } else {
                    break;
                }
            }
        }
        keys = [];
    }
    return false;
}

/**
 * transfer fuck word to *
 * @param name
 * @param to
 * @returns {*}
 */
fuckword.prototype.transferChatContent = function(name,to){
    var str = '';
    var keys = [];
    var record = [];
    for(var i = 0; i < name.length ; i++){
        var ch = name.charAt(i);
        keys.push(ch);
        var index = '["' + keys.join('"]["') +'"]';
        if(!!eval('wordConfig' + index)){
            for(var j = i + 1 ; j < name.length; j ++ ){
                var ch2 = name.charAt(j);
                keys.push(ch2);
                var index2 = '["' + keys.join('"]["') +'"]';
                if( !!eval(('wordConfig' + index2)) ){ // 能拿到最后的fuck  说明完全匹配了
                    if(!!eval(('wordConfig' + index2 + '["fuck"]'))){
                        record.push(keys.join(''));
                    }
                }else{
                    break;
                }
            }
        }
        keys = [];
    }
    if(record.length > 0){
        for(var i  = 0; i < record.length; i++){
            var str = '';
            for(var j = 0; j < record[i].length; j++){
                str += to
            }
            name = name.replace(record[i],str);
        }
    }
    return name;
}

module.exports = new fuckword();