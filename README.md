# fuckword

[![Greenkeeper badge](https://badges.greenkeeper.io/NextZeus/fuckword.svg)](https://greenkeeper.io/)

[/model/fuckwordRegexp.js  使用正则表达式检测非法词]

### method

### check name contains fuck word

```javascript
var fuckword = require('fuckword');
var content = 'fuck';
var isIllegal = fuckword.checkContentIllegal(content);
if(isIllegal){
    console.log('name contains fuck word');
}

```

### transfer content` word which contains fuck word  to *
```javascript

var fuckword = require('fuckword');
var name = 'fuck you !!!!';
var transferedContent = fuckword.transferContent(name,"*");

console.log('transferedContent is :',transferedContent);
//the result is -->>>transferedContent is :***k you !!!
```
