# tweet-patch

[![Build Status](https://travis-ci.org/radiovisual/tweet-patch.svg?branch=master)](https://travis-ci.org/radiovisual/tweet-patch)

> Convert plain-text back into twitter-ready markup.

## Version 2.0

Version 2.0 of this module no longer attempts to locate/use the `data.entities` objects from the Twitter API returned data.
It will, however, use the `data.entities.urls` array from the Twitter data (if available) to determine if there is a media 
url attached to the end of the plain-text tweet by the Twitter API. You can use the `stripTrailingUrl` option to remove this
trailing media url if you are serving plain-text tweets without embedded media support.


## Install

```
$ npm install --save tweet-patch
```

## Usage

**Option 01:** Pass in a string with urls, hashtags and user-mentions:

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
Type: `object` `string`

The tweet object returned from the Twitter API, or a string containing hashtags, urls and user-mentions.

#### options

##### hrefProps

Type: `object` `string`<br>
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
property. The reason for this is because we only want to strip the trailing media url if you are serving plain-text tweets, 
(no media support) and you want to clean up the tweet text. This option only works when you have supplied a Tweet object with
Twitter's `entities.urls` property to ensure that we aren't deleting actual urls put there by the tweet author.
  
##### useExistingHTML

Type: `Boolean` <br>
Default: `false`

This is only used if you have supplied a data object returned from the Twitter API, and the Twitter API has supplied
an `html` property on that object for you.

## Known Limitations

- Some tweets will be formatted in a way that makes it impossible to accurately parse the data. For example, if a url is
typed inside of parenthesis: `(http://t.co/foo)` tweet-patch will see the closing parenthesis as part of the url. For more
information, see issue [#8](https://github.com/radiovisual/tweet-patch/issues/8).

## License

MIT @ [Michael Wuergler](http://numetriclabs.com/)


