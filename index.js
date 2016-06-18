var rp = require('request-promise');
var parseString = require('xml2js').parseString;
var util = require('util')
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var prepBucket = function(bucket,callback) {
  s3.headBucket({Bucket: bucket}, function(err,data) {
    if(err) {
      console.log('Creating Bucket: '+bucket);
      s3.createBucket({Bucket: bucket}, function(err,data) {
        if(err) {
          console.log(err);
        } else {
          callback(bucket);
        }
      });
    } else {
      callback(bucket);
    }
  });
}

var writeItem = function(item,bucket) {
  var guid = item.guid[0]._;
  var params = {Bucket:bucket,Key:guid,Body:item['content:encoded'][0]}
  if(guid) {
    console.log('Writing: '+util.inspect(params));
    s3.putObject(params,function(err,data) {
      if(err) console.log(err);
    })
  } else {
    console.log('No GUID found for item: '+util.inspect(item))
  }
}
var processXmlToItems = function(xml,itemCallback) {
  parseString(xml, function (err, result) {
    for (item of result.rss.channel[0].item) itemCallback(item);
  })
}

exports.handler = function(event, context, callback) {
  prepBucket(event.bucket, function(bucket) {
    rp(event.url).then(function(xml) {
      processXmlToItems(xml,function(item) {
        writeItem(item,bucket);
      })
    });
  })
};

exports.handler({url:'https://blog.vandegriftinc.com/feed',bucket:'bglick-vandegriftinc-feed-backup'});
