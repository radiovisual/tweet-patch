# tweet-patch

[![Build Status](https://travis-ci.org/radiovisual/tweet-patch.svg?branch=master)](https://travis-ci.org/radiovisual/tweet-patch)

> Use the Twitter API return data to convert plain-text back into twitter-ready markup

This module will take the JSON data returned to you by the Twitter API, and use its 
`entities.hashtags`, `entities.urls` and `entities.user_mentions` to rebuild the plain-text tweet
back into twitter-ready markup.
 

## Usage

```js

var tweetPatch = require('tweet-patch');

// Pass in the returned tweet data, and get twitter-ready HTML in return
tweetPatch( { text:'@SomeUser, go check out this #awesome #thing http://t.co/a01234!' } )
/* =>
    <a href="https://twitter.com/SomeUser">@SomeUser</a> go, check out this 
    <a href="https://twitter.com/hashtag/awesome">#awesome</a> 
    <a href="https://twitter.com/hashtag/thing">#thing</a> 
    <a href="http://t.co/a01234">http://t.co/a01234</a>!
*/

```

## License

MIT @ [Michael Wuergler](http://numetriclabs.com/)


