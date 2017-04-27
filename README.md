# Strava Segment Rank

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
