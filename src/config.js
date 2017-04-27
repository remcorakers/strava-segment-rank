/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const mongoDatabaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/strava-segment-rank';

export const keys = {
  google: {
    trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID, // UA-XXXXX-X
    maps: process.env.GOOGLE_MAPS_KEY,
  },
};
