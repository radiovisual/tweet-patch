'use strict';
var tweetpatch = require('./');
var assert = require("assert");

var test_tweet1 = {created_at:"Tue Jun 10 21:44:10 +0000 2014",id:0x69ccc008b881000,id_str:"476479963307446273",text:"Great idea to help save the planet: #SolarRoadways #SolarFreakinRoadways http://t.co/shxFVnkIOm",truncated:!1,in_reply_to_status_id:null,in_reply_to_status_id_str:null,in_reply_to_user_id:null,in_reply_to_user_id_str:null,in_reply_to_screen_name:null,is_quote_status:!1,entities:{hashtags:[{text:"SolarRoadways",indices:[36,50]},{text:"SolarFreakinRoadways",indices:[51,72]}],symbols:[],user_mentions:[],urls:[{url:"http://t.co/shxFVnkIOm",expanded_url:"http://goo.gl/rdMb8n",display_url:"goo.gl/rdMb8n",indices:[73,95]}]}}
var valid_tweet_markup1 = 'Great idea to help save the planet: <a href="https://twitter.com/hashtag/SolarRoadways">#SolarRoadways</a> <a href="https://twitter.com/hashtag/SolarFreakinRoadways">#SolarFreakinRoadways</a> <a href="http://t.co/shxFVnkIOm">http://t.co/shxFVnkIOm</a>';

var test_tweet2 = {created_at:"Tue May 26 10:47:36 +0000 2015",id:0x85ed22bd916a000,id_str:"603150485881790464",text:'@mrdoob after pondering the implications of "cake printing", I concluded that the world is almost ready! 😄 And thanks, I had an awesome day!',geo:null,coordinates:null,place:null,contributors:null,is_quote_status:!1,retweet_count:0,favorite_count:1,entities:{hashtags:[],symbols:[],user_mentions:[{screen_name:"mrdoob",name:"Ricardo Cabello",id:20733754,id_str:"20733754",indices:[0,7]}],urls:[]},favorited:!1,retweeted:!1,lang:"en"};
var valid_tweet_markup2 = '<a href="https://twitter.com/mrdoob">@mrdoob</a> after pondering the implications of "cake printing", I concluded that the world is almost ready! 😄 And thanks, I had an awesome day!';


describe('tweet-patch', function(){

    it('should convert plain-text into twitter-ready markup', function(){
        assert.equal(tweetpatch(test_tweet1), valid_tweet_markup1);
        assert.equal(tweetpatch(test_tweet2), valid_tweet_markup2);
    });

    it('should return an unmodified string if no `entities` exist', function(){
        var td = { text: "This has no entities" };
        assert.equal(tweetpatch(td), "This has no entities");
    });

    it('should not fail if `entities.hashtags` does not exist', function(){
        var td = { text: "This has no entities.hashtags", entities:{symbols:[],user_mentions:[],urls:[]}};
        assert.equal(tweetpatch(td), "This has no entities.hashtags");
    });

    it('should not fail if `entities.user_mentions` does not exist', function(){
        var td = { text: "This has no entities.user_mentions", entities:{hashtags:[],symbols:[],urls:[]}};
        assert.equal(tweetpatch(td), "This has no entities.user_mentions");
    });

    it('should not fail if `entities.urls` does not exist', function(){
        var td = { text: "This has no entities.urls", entities:{hashtags:[],symbols:[],user_mentions:[]}};
        assert.equal(tweetpatch(td), "This has no entities.urls");
    });

    it('should return the `html` string if exists', function(){
        var td = { text: "This has an html string.", html: "<b>Check out my HTML</b>" };
        assert.equal(tweetpatch(td), "<b>Check out my HTML</b>");
    });

});