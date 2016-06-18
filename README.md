# rss-backup
Backup RSS feed to S3 bucket via Amazon Lambda

Designed for backing up medium.com, but should work for similarly structured RSS

Payload should look like

```
{
  "url":"http://url.to.rss.feed.here"
  "bucket":"aws bucket name"
}
```

This will re-download every article every time. Note that it pulls the content directly from the RSS and doesn't follow the links, so make sure you RSS is set to provide the full article.
