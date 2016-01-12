'use strict';
var getUrls = require('get-urls');
var taghash = require('taghash');
var mentions = require('get-user-mentions');

module.exports = function(data) {
    if (typeof data !== 'object' || Array.isArray(data)){
        throw TypeError('tweet-patch expects an object.');
    }

    var txt = data.text;

    // If the tweet data already has HTML, return that.
    if (data.html) {
        return data.html;
    }

    if (!data.entities) {
        return manualRebuild(txt);
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // convert all the hashtags
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    var hashtags = data.entities.hashtags;

    if (hashtags) {
        hashtags.forEach(function (item, index, array) {
            txt = txt.replace("#"+item.text, buildHashLink(item.text));
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // convert all the urls
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    var urls = data.entities.urls;

    if (urls) {
        urls.forEach(function (item, index,array) {
            txt = txt.replace(item.url, wrapLink(item.url));
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // convert all the user mentions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    var user_mentions = data.entities.user_mentions;

    if (user_mentions) {
        user_mentions.forEach(function(item, index, array) {
            txt = txt.replace("@"+item.screen_name, wrapUserMention(item.screen_name));
        });
    }

    return txt;
};

/**
 * Rebuild the string without an `entities` object.
 *
 * @note: this will only run if the `entities` object does not exist.
 * @param {String} str
 * @returns {String}
 */

function manualRebuild(str) {
    var _str = taghash(str);

    mentions(str).map(function(user){
        _str = _str.replace(user, wrapUserMention(user));
    });

    var urls = getUrls(str);
    urls.map(function(item) {
       _str = _str.replace(new RegExp(item, 'g'), wrapLink(item));
    });

    return _str;
}

function buildHashLink(text) {
    return "<a href=\"https://twitter.com/hashtag/"+text+"\">#"+text+"</a>";
}

function wrapLink(href) {
    return "<a href=\""+href+"\">"+href+"</a>";
}

function wrapUserMention(screenname) {
    screenname = screenname.replace(/^@/, '');
    return "<a href=\"https://twitter.com/"+screenname+"\">@"+screenname+"</a>";
}