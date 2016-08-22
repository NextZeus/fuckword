# fuckword

### method

### check name contains fuck word

```javascript

var fuckword = require('fuckword');
var name = 'fuck';
var isIllegal = fuckword.checkNameIllegal(name);
if(isIllegal){
    console.log('name contains fuck word');
}

```

### transfer content` word which contains fuck word  to *
var fuckword = require('fuckword');
var name = 'fuck you !!!!';
var transferedContent = fuckword.transferChatContent(name,"*");

console.log('name contains fuck word');
