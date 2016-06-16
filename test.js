'use strict';
var tweetpatch = require('./');
var assert = require("assert");

var test_tweet1 = {created_at:"Tue Jun 10 21:44:10 +0000 2014",id:0x69ccc008b881000,id_str:"476479963307446273",text:"Great idea to help save the planet: #SolarRoadways #SolarFreakinRoadways http://t.co/shxFVnkIOm",truncated:!1,in_reply_to_status_id:null,in_reply_to_status_id_str:null,in_reply_to_user_id:null,in_reply_to_user_id_str:null,in_reply_to_screen_name:null,is_quote_status:!1,entities:{hashtags:[{text:"SolarRoadways",indices:[36,50]},{text:"SolarFreakinRoadways",indices:[51,72]}],symbols:[],user_mentions:[],urls:[{url:"http://t.co/shxFVnkIOm",expanded_url:"http://goo.gl/rdMb8n",display_url:"goo.gl/rdMb8n",indices:[73,95]}]}}
var valid_tweet_markup1 = 'Great idea to help save the planet: <a href="https://twitter.com/hashtag/SolarRoadways">#SolarRoadways</a> <a href="https://twitter.com/hashtag/SolarFreakinRoadways">#SolarFreakinRoadways</a> <a href="http://t.co/shxFVnkIOm">http://t.co/shxFVnkIOm</a>';

var test_tweet2 = {created_at:"Tue May 26 10:47:36 +0000 2015",id:0x85ed22bd916a000,id_str:"603150485881790464",text:'@mrdoob after pondering the implications of "cake printing", I concluded that the world is almost ready! 😄 And thanks, I had an awesome day!',geo:null,coordinates:null,place:null,contributors:null,is_quote_status:!1,retweet_count:0,favorite_count:1,entities:{hashtags:[],symbols:[],user_mentions:[{screen_name:"mrdoob",name:"Ricardo Cabello",id:20733754,id_str:"20733754",indices:[0,7]}],urls:[]},favorited:!1,retweeted:!1,lang:"en"};
var valid_tweet_markup2 = '<a href="https://twitter.com/mrdoob">@mrdoob</a> after pondering the implications of "cake printing", I concluded that the world is almost ready! 😄 And thanks, I had an awesome day!';

describe('tweet-patch', function(){

    it('expects an object', function(){
        assert.throws(function(){
            tweetpatch([]);
        }, TypeError, 'tweet-patch expects an object.');
    });

    it('expects an object with data.text property', function(){
        assert.throws(function(){
            tweetpatch({});
        }, TypeError, 'tweet-patch expects a string or tweet object with a text property.');
    });

    it('should convert plain-text into twitter-ready markup', function(){
        assert.equal(tweetpatch(test_tweet1), valid_tweet_markup1);
        assert.equal(tweetpatch(test_tweet2), valid_tweet_markup2);
    });

    it('should build hash links without an `entities` object', function(){
        var td = { text: "#many #hastags" };
        assert.equal(tweetpatch(td), '<a href="https://twitter.com/hashtag/many">#many</a> <a href="https://twitter.com/hashtag/hastags">#hastags</a>');
    });

    it('should build hash links and urls without an `entities` object', function(){
        var td = { text: "#many #hastags http://url.com" };
        assert.equal(tweetpatch(td), '<a href="https://twitter.com/hashtag/many">#many</a> <a href="https://twitter.com/hashtag/hastags">#hastags</a> <a href="http://url.com">http://url.com</a>');
    });

    it('should build user mentions without an `entities` object', function(){
        var td = { text: "hello @user1 and @user2!" };
        assert.equal(tweetpatch(td), 'hello <a href="https://twitter.com/user1">@user1</a> and <a href="https://twitter.com/user2">@user2</a>!');
    });

    it('should process multiple duplicate urls without an `entities` object ', function(){
        var td = { text: "http://url.com http://url.com" };
        assert.equal(tweetpatch(td), '<a href="http://url.com">http://url.com</a> <a href="http://url.com">http://url.com</a>');
    });

    it('should not fail if `entities.urls` does not exist', function(){
        var td = {text: "This has no entities.urls", entities:{hashtags:[],symbols:[],user_mentions:[]}};
        assert.equal(tweetpatch(td), "This has no entities.urls");
    });

    it('should return the `html` string if exists and useExistingHTML"true', function(){
        var td = {text: "This has an html string.", html: "<b>Check out my HTML</b>"};
        assert.equal(tweetpatch(td, {useExistingHTML: true}), "<b>Check out my HTML</b>");
    });

    it('should convert all links', function() {
        var td = {text: 'What if the #Maldives beautiful marine life would vanish? https://t.co/pIXQvQRqTO #WorldOceansDay https://t.co/BMmV1Pu5BB'};
        assert.equal(tweetpatch(td), 'What if the <a href="https://twitter.com/hashtag/Maldives">#Maldives</a> beautiful marine life would vanish? <a href="https://t.co/pIXQvQRqTO">https://t.co/pIXQvQRqTO</a> <a href="https://twitter.com/hashtag/WorldOceansDay">#WorldOceansDay</a> <a href="https://t.co/BMmV1Pu5BB">https://t.co/BMmV1Pu5BB</a>');
    });

    it('should strip the trailing url when entities.urls is empty', function() {
        var td = {text: '#hi https://t.co/123', entities:{hashtags:[],symbols:[],urls:[]}};
        assert.equal(tweetpatch(td, {stripTrailingUrl:true}), '<a href="https://twitter.com/hashtag/hi">#hi</a>');
    });

    it('should not strip the trailing url when there is no entities.urls', function() {
        var td = {text: '#hi https://t.co/123', entities:{hashtags:[],symbols:[]}};
        assert.equal(tweetpatch(td, {stripTrailingUrl:true}), '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123">https://t.co/123</a>');
    });

    it('should not strip the trailing url when there is no entities', function() {
        var td = {text: '#hi https://t.co/123'};
        assert.equal(tweetpatch(td, {stripTrailingUrl:true}), '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123">https://t.co/123</a>');
    });

    it('should not strip the trailing url when string input is used', function() {
        var td = '#hi https://t.co/123';
        assert.equal(tweetpatch(td, {stripTrailingUrl:true}), '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123">https://t.co/123</a>');
    });

    it('should accept a string', function() {
        assert.equal(tweetpatch('#many #hastags'), '<a href="https://twitter.com/hashtag/many">#many</a> <a href="https://twitter.com/hashtag/hastags">#hastags</a>');
    });

    it('hrefProps: string', function() {
        assert.equal(tweetpatch('#hi https://t.co/123', {hrefProps: 'class="myClass"'}), '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123" class="myClass">https://t.co/123</a>');
    });

    it('hrefProps: object', function() {
        assert.equal(tweetpatch('#hi https://t.co/123', {hrefProps: {class: 'myClass'}}), '<a href="https://twitter.com/hashtag/hi">#hi</a> <a href="https://t.co/123" class="myClass">https://t.co/123</a>');
    });
});
