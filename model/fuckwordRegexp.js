/**
 * Created by lixiaodong on 16/9/22.
 */
/**
 * Created by lixiaodong on 16/9/22.
 */

var fs = require('fs');
var async = require('async');

var FuckWord = function () {
    this.fuckwords = '';
    this.init();
}

FuckWord.prototype.init = function () {
    console.time('initfuckword');
    var self = this;
    var fuckwords = '';

    async.waterfall([
        function (cb) {
            //读取文件
            fuckwords = fs.readFileSync(__dirname+'/../config/fuckword.txt','utf8');
            cb();
        },
        function (cb) {
            //特殊字符
            var specialSymbol = "\\!|\\@|\\#|\\$|\\%|\\^|\\&|\\*|\\(|\\)|\\=|\\-|\\_|\\+|\\{|\\}|\\[|\\]|\\,|\\.|\\<|\\>|\\/|\\?|\\`|\\~|\\;|\\:";
            var regexp = new RegExp("("+specialSymbol+")");

            fuckwords = fuckwords.split('、');
            for(var i = 0 ; i < fuckwords.length; i++){
                if(regexp.test(fuckwords[i])){
                    var word = fuckwords[i];
                    var str = '';
                    for(var j = 0 ; j < word.length; j++){
                        if(regexp.test(word[j])){
                            //console.warn('illegal-word',word[j]);
                            str += '\\'+ word[j];
                        } else {
                            str += word[j];
                        }
                    }
                    fuckwords[i] = str;
                }

                if(i == 0){
                    self.fuckwords += (fuckwords[i]);
                } else {
                    self.fuckwords += ("|"+fuckwords[i]);
                }
            }
            cb();
        }
    ], function () {
        console.timeEnd('initfuckword');
        console.log('init-success')
    });
}

FuckWord.prototype.check = function (word) {
    var regWord =  this.fuckwords;
    console.time('check')
    var reg = new RegExp("("+regWord+")");
    console.timeEnd('check');
    console.log('test-reg-->>',reg.test(word));
    return reg.test(word);
}

module.exports = new FuckWord();