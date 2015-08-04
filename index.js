'use strict';

module.exports = function(data){

    var txt = data.text;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // convert all the hashtags
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    var hashtags = data.entities.hashtags;

    if(hashtags){
        hashtags.forEach(function(item, index, array){
            txt = txt.replace("#"+item.text, buildHashLink(item.text));
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // convert all the urls
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    var urls = data.entities.urls;

    if(urls){
        urls.forEach(function(item, index,array){
            txt = txt.replace(item.url, wrapLink(item.url));
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    // convert all the user mentions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    var user_mentions = data.entities.user_mentions;

    if(user_mentions){
        user_mentions.forEach(function(item, index, array){
            txt = txt.replace("@"+item.screen_name, wrapUserMention(item.screen_name));
        });
    }

    return txt;
};

function buildHashLink(text){
    return "<a href=\"https://twitter.com/hashtag/"+text+"\">#"+text+"</a>";
}

function wrapLink(href){
    return "<a href=\""+href+"\">"+href+"</a>";
}

function wrapUserMention(screenname){
    return "<a href=\"https://twitter.com/"+screenname+"\">@"+screenname+"</a>";
}