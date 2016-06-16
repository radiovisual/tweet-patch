# tweet-patch

[![Build Status](https://travis-ci.org/radiovisual/tweet-patch.svg?branch=master)](https://travis-ci.org/radiovisual/tweet-patch)

> Convert plain-text back into twitter-ready markup.

## Version 2.0

Version 2.0 of this module no longer attempts to locate/use the `data.entities` objects from the Twitter API returned data.
It will, however, use the `data.entities.urls` array from the Twitter data (if available) to determine if the Twitter API
has unwillingly attached the url to the tweet at the end of the `tweet.text` property. If so, you can use the new `stripTrailingUrl`
option to strip it from the return text.


## Install

```
$ npm install --save tweet-patch
```

## Usage

**Option 01:** Pass in a string with urls, hashtags and user-mentions
```js
var tweetPatch = require('tweet-patch');

tweetPatch('@SomeUser, go check out this #awesome #thing http://t.co/a01234!');
```

**Option 02:** Pass in a Twitter Object from the Twitter API:
```js
var tweetPatch = require('tweet-patch');

const tweetObj = {
    text: '@SomeUser, go check out this #awesome #thing http://t.co/a01234!',
    entities: {
        urls: [...],
        // ...
    }
}
    
tweetPatch(tweetObj);
```



Both examples above would result in the following return string *(formatted for readability)*:

```
'<a href="https://twitter.com/SomeUser">@SomeUser</a> go, check out this 
 <a href="https://twitter.com/hashtag/awesome">#awesome</a> 
 <a href="https://twitter.com/hashtag/thing">#thing</a> 
 <a href="http://t.co/a01234">http://t.co/a01234</a>!'
```

## API

### tweetPath(data, [options])

#### data

*Required* <br>
Type: `object|string`

The tweet object returned from the Twitter API, or a string containing hashtags, urls and user-mentions.

#### options

##### hrefProps

Type: `Object|String` <br>
Default: `None`

Pass in an object and the key:value pairs will be assigned to the anchor tags that are created (uses [obj-to-property-string](https://github.com/radiovisual/obj-to-property-string)).
Pass in a string, and that string will be assigned to the url anchor tags as-is.

Examples:

```js
// Using an object
tweetpatch('#hi https://t.co/123', {hrefProps: {class: 'myClass'}});
//=> '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123" class="myClass">https://t.co/123</a>'

// Using a string
tweetpatch('#hi https://t.co/123', {hrefProps: 'class="myClass"'});
//=> '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123" class="myClass">https://t.co/123</a>'
```

##### stripTrailingUrl

Type: `Boolean` <br>
Default: `false`

This is only used if you have supplied a data object returned from the Twitter API, and that object has the `entities.urls`
property. The reason for this is because we only want to strip the trailing url if Twitter added the url to the end of the `text` 
property, but didn't register the added url with `entities.urls`. This ensures that we aren't deleting actual urls put there by the
  tweet author.
  
##### useExistingHTML

Type: `Boolean` <br>
Default: `false`

This is only used if you have supplied a data object returned from the Twitter API, and the Twitter API has supplied
an `html` property on that object for you.


## License

MIT @ [Michael Wuergler](http://numetriclabs.com/)


