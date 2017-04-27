# Strava Segment Rank

View the most popular Strava segments in a geographical area.

## Requirements

- Node.js >= 6.5
- MongoDB

## Getting started

1. Clone this repository and run `yarn install`
2. Configure mongodb connection string in `/src/config.js`, default value is `mongodb://localhost:27017/strava-segment-rank`.
3. Create a file `/data/strava_config` with the following contents, replacing `YOUR-STRAVA-ACCESS-TOKEN` with your personal Strava API token:
```
{
  "access_token"    :"YOUR-STRAVA-ACCESS-TOKEN"
  , "client_id"     :"Your apps Client ID (Required for oauth)"
  , "client_secret" :"Your apps Client Secret (Required for oauth)"
  , "redirect_uri"  :"Your apps Authorization Redirection URI (Required for oauth)"
}
```
4. Run with `yarn start`

## Thanks to

- [React Starter Kit](https://github.com/kriasoft/react-starter-kit)
