/**
 * Created by lixd on 16/8/22.
 */
var fs = require('fs');
var async = require('async');

function FuckWord(opt){
    this.wordConfig = null;
    var loadConfig = false;
    if(!!opt){
        this.configDir = opt.configDir;//fuckword.txt dir
        if(opt.init){//init your fuck word config
            this.generateConfig();
        } else {
            loadConfig = true;
        }
    } else {
        loadConfig = true;
    }

    if(loadConfig){
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
    //transfer  example : ABC ABD {A:{B:{C:{fuck:1},D:{fuck:1}}}}
    if(!!fuckWordData && fuckWordData.length > 0){
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

        var fileContent = "exports.fuckwods = " + JSON.stringify(configObj);
        var resFilePath = __dirname + '/../lib/wordConfig.js';

        fs.writeFile(resFilePath,fileContent,null,function(err){
            if(!err){
                self.wordConfig = require(resFilePath).fuckwods;
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
    var str = 'self.wordConfig';
    for(var i = 0; i < name.length ; i++){
        var char = name.charAt(i);
        str += '["' + char + '"]';
        var value = eval(str);
        if(!!value){
            if(eval(str+'["fuck"]')){
                return true;
            }
        } else {
            return false;
        }
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

module.exports = new FuckWord();