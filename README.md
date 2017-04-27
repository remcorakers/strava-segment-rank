# Strava Segment Rank

[![GitHub release](https://img.shields.io/github/release/remcorakers/strava-segment-rank.svg?style=flat-square)](https://github.com/remcorakers/strava-segment-rank/tags)
[![Travis](https://img.shields.io/travis/remcorakers/strava-segment-rank.svg?style=flat-square)](https://travis-ci.org/remcorakers/strava-segment-rank)
[![Code Climate](https://img.shields.io/codeclimate/github/remcorakers/strava-segment-rank.svg?style=flat-square)](https://codeclimate.com/github/remcorakers/strava-segment-rank)
[![Gemnasium](https://img.shields.io/gemnasium/remcorakers/strava-segment-rank.svg?style=flat-square)](https://gemnasium.com/remcorakers/strava-segment-rank)

View the most popular Strava segments in a geographical area. Check out the [demo](https://strava-segment-rank.azurewebsites.net/).

## Requirements

- Node.js >= 6.5
- MongoDB

## Getting started

1. Clone this repository and run `yarn install`
2. The application uses the following environment variables. Overwrite them where needed.
```
STRAVA_ACCESS_TOKEN: required; your Strava API access token
DATABASE_URL: MongoDB connection string, default value is mongodb://localhost:27017/strava-segment-rank
GOOGLE_MAPS_KEY: optional; Google Maps key
GOOGLE_ANALYTICS_TRACKING_ID: optional; Google Analytics tracking ID
```
3. Run with `yarn start`

## Thanks to

- [React Starter Kit](https://github.com/kriasoft/react-starter-kit)
