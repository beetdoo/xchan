# xchan 
**A Chrome extension that anonymizes Twitter/X to reduce groupthink.**

This extension hides all identity-based social signals on Twitter/X by replacing usernames with anonymized hashed IDs, hiding profile photos, and removing likes, retweets, and view counts. Engage with content based on its merits alone. 

## Features

- Replaces all visible usernames and handles with consistent hashed IDs
- Hides all profile photos (avatars)
- Removes like, retweet, and view counts


## Installation

1. Download the latest ZIP from the [Chrome Web Store](https://chrome.google.com/webstore/) or clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load Unpacked** and select the `xchan/` folder

## Permissions

This extension only runs on `x.com` and `twitter.com`.  
It does **not collect, store, or transmit any data**.

## Development

To run locally:
```bash
git clone https://github.com/beetdoo/xchan.git
cd xchan