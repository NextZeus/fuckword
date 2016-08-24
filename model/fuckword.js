/**
 * Created by lixd on 16/8/22.
 */
var fs = require('fs');
var async = require('async');

function FuckWord(opt){
    this.configDir = opt.configDir;//fuckword.txt dir
    if(opt.init){//init your fuck word config
        this.generateConfig();
    }

    this.wordConfig = null;

    if(!opt.init){
        var filePath = __dirname + '/../lib/wordConfig.js';
        var filestat = fs.statSync(filePath);
        if(filestat.isFile()){
            var wordConfig = require(filePath).fuckwods;
            if(!!wordConfig){
                this.wordConfig = wordConfig;
            }
        }
    }
}

/**
 * put your fuckword.txt in config directory
 */
FuckWord.prototype.generateConfig = function () {
    var self = this;
    async.waterfall([
        function (cb) {
            self.generateForbidJson(cb);
        },
        function (cb) {
            self.initWordConfig(cb);
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
 * config/fuckword2016.txt file contains all fuck words in 2016
 * if you want to generate your config , call this function and init function
 * generate forbid json file by fuckword2016.txt
 */
FuckWord.prototype.generateForbidJson = function(next) {
    var self = this;
    var fuckwords;
    var fuckwordArray;

    var filePath = self.configDir+'fuckword.txt';
    var fileStat = fs.statSync(filePath);
    if(!fileStat.isFile()){
        throw new Error('File Path Error!');
    }

    fs.readFile(this.configDir+'fuckword.txt','utf8', function (err,data) {
        if(!err && !!data){
            fuckwords = data;
            fuckwordArray = fuckwords.split('、');

            console.log(fuckwordArray[0],fuckwordArray.length);
            for(var i = 0 ; i < fuckwordArray.length; i++){
                fuckwordArray[i] = {
                    forbid  :   fuckwordArray[i]
                };
            }

            fs.writeFile('../config/forbid.json',JSON.stringify(fuckwordArray),null, function () {
                next();
            });
        } else {
            throw new Error('Generate config file error!!!');
        }
    });
}

//init lib wordConfig.js
FuckWord.prototype.initWordConfig = function(next){
    var self = this;

    var fuckWordData = require('../config/forbid.json');
    //transfer  example : ABC  {A:{B:{C:{fuck:1}
    var str = '';
    if(!!fuckWordData && fuckWordData.length > 0){
        for(var i = 0; i < fuckWordData.length; i++){
            if(typeof(fuckWordData[i]) == 'object' ){
                var keys = Object.keys(fuckWordData[i]);
                var content = fuckWordData[i][keys[0]];
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
        fs.writeFile(__dirname + '/../lib/wordConfig.js',str,null,function(err){
            if(!err){
                self.wordConfig = require(__dirname + '/../lib/wordConfig.js').fuckwods;
                console.log('Init WordConfig Success!!!');
                next();
            }else{
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
FuckWord.prototype.checkNameIllegal = function(name){
    var self = this;
    if(!self.wordConfig){
        return false;
    }

    var keys = [];
    for(var i = 0; i < name.length ; i++){
        var ch = name.charAt(i);
        keys.push(ch);
        var index = '["' + keys.join('"]["') +'"]';
        console.log('index-->>>',index,eval('self.wordConfig'+index));
        if(!!eval('self.wordConfig' + index)){
            for(var j = i + 1 ; j < name.length; j ++ ){
                var ch2 = name.charAt(j);
                keys.push(ch2);
                var index2 = '["' + keys.join('"]["') +'"]';
                console.log('index2-->>>',index2);
                if( !!eval(('self.wordConfig' + index2)) ){ // 能拿到最后的fuck  说明完全匹配了
                    if(!!eval(('self.wordConfig' + index2 + '["fuck"]'))){
                        return true;
                    }
                } else {
                    console.log('break----');
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
FuckWord.prototype.transferContent = function(name,to){
    var self = this;
    if(!self.wordConfig){
        return false;
    }
    var keys = [];
    var record = [];
    for(var i = 0; i < name.length ; i++){
        var ch = name.charAt(i);
        keys.push(ch);
        var index = '["' + keys.join('"]["') +'"]';
        if(!!eval('self.wordConfig' + index)){
            for(var j = i + 1 ; j < name.length; j ++ ){
                var ch2 = name.charAt(j);
                keys.push(ch2);
                var index2 = '["' + keys.join('"]["') +'"]';
                if( !!eval(('self.wordConfig' + index2)) ){ // 能拿到最后的fuck  说明完全匹配了
                    if(!!eval(('self.wordConfig' + index2 + '["fuck"]'))){
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

module.exports = FuckWord;