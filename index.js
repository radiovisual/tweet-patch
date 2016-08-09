'use strict';
var getUrls = require('get-urls');
var taghash = require('taghash');
var mentions = require('get-user-mentions');
var propertyString = require('obj-to-property-string');
var objectAssign = require('object-assign');
var escapeStringRegexp = require('escape-string-regexp');

module.exports = function (data, opts) {
	var txt;
	var dataType = typeof data;

	if (dataType === 'string') {
		txt = data;
	} else if (dataType === 'object' && data.text) {
		txt = data.text;
	} else {
		throw new TypeError('tweet-patch expects a string or tweet object with a text property.');
	}

	opts = opts || {};

	var defaults = {
		useExistingHTML: false,
		stripTrailingUrl: false,
		hrefProps: {}
	};

	opts = objectAssign(defaults, opts);

	var propString;

	if (typeof opts.hrefProps === 'object') {
		propString = propertyString(opts.hrefProps);
	} else if (typeof opts.hrefProps === 'string') {
		propString = opts.hrefProps;
	}

	if (opts.useExistingHTML && data.html) {
		return data.html;
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	// convert all the urls
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	var allUrls = getUrls(txt) || [];
	var twitterUrls = (data.entities && data.entities.urls) ? data.entities.urls : null;

	// Do we want to strip the trailing url? Only in the condition that we are using a
	// Twitter Object with entities.urls and there is at least one url in the entire tweet text.
	if (opts.stripTrailingUrl && dataType === 'object' && allUrls.length > 0 && twitterUrls && twitterUrls.length === 0) {
		var trailingUrl = allUrls.pop();
		txt = txt.replace(trailingUrl, '').trim();
	}

	allUrls.forEach(function (url) {
		try {
			txt = txt.replace(new RegExp(url, 'g'), wrapLink(url, propString));
		} catch (err) {
			if (err.message.indexOf('Invalid regular expression') > -1) {
				txt = txt.replace(new RegExp(escapeStringRegexp(url), 'g'), wrapLink(url, propString));
			}
		}
	});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	// convert all the user mentions
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	var userMentions = mentions(txt) || [];
	userMentions.forEach(function (user) {
		txt = txt.replace(user, wrapUserMention(user));
	});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	// convert all the hashtags
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	txt = taghash(txt);

	return txt;
};

function wrapLink(href, props) {
	if ((props.trim && props.trim() !== '') || (typeof props === 'object' && !Object.keys(props).length)) {
		props = ' ' + props;
	}
	return '<a href="' + href + '"' + props + '>' + href + '</a>';
}

function wrapUserMention(screenname) {
	screenname = screenname.replace(/^@/, '');
	return '<a href="https://twitter.com/' + screenname + '">@' + screenname + '</a>';
}
