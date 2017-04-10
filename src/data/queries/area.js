import strava from 'strava-v3';
import moment from 'moment';
import _ from 'lodash';

import {
  GraphQLFloat as FloatType,
  GraphQLString as StringType,
} from 'graphql';
import AreaType from '../types/AreaType';

async function getStravaCallFromCache(db, method, args) {
  const cache = await db.collection('stravaCache').findOne({ method, args }, { result: 1 });
  if (cache) {
    return cache.result;
  }
  return false;
}

async function saveStravaCall(db, method, args, result) {
  await db.collection('stravaCache').insertOne({ method, args, result, created: new Date() });
}

async function getStravaListLeaderboard(db, segmentId, page) {
  const args = { id: segmentId, per_page: 200, page, date_range: 'this_year' };
  const cachedResult = await getStravaCallFromCache(db, 'listLeaderboard', args);

  if (cachedResult) {
    return cachedResult;
  }

  const result = await new Promise((resolve, reject) => {
    strava.segments.listLeaderboard(args, (err, res) => {
      if (err) {
        reject(new Error(err));
      }
      console.log(`fetched leaderboard for segment ${segmentId}, page ${page}`);
      resolve(res);
    });
  });

  await saveStravaCall(db, 'listLeaderboard', args, result);

  return result;
}

async function getStravaSegmentsInArea(db, bounds, activityType) {
  const args = { bounds };
  if (activityType !== null) {
    args.activity_type = activityType;
  }

  const cachedResult = await getStravaCallFromCache(db, 'explore', args);
  if (cachedResult) {
    return cachedResult;
  }

  const result = await new Promise((resolve, reject) => {
    strava.segments.explore(args, (err, res) => {
      if (err) {
        reject(new Error(err));
      }
      console.log(`fetched explore for bounds ${bounds} and activityType ${activityType}`);
      resolve(res.segments);
    });
  });

  await saveStravaCall(db, 'explore', args, result);

  return result;
}

async function getLeaderboard(db, segment) {
  let leaderboard = null;
  let page = 1;
  while (!leaderboard || leaderboard.entry_count > leaderboard.entries.length) {
    const leaderboardData = await getStravaListLeaderboard(db, segment.id, page); // eslint-disable-line no-await-in-loop, no-loop-func

    if (!leaderboardData || !leaderboardData.entries || leaderboardData.entries.length === 0) {
      break;
    }

    if (leaderboard == null) {
      leaderboard = leaderboardData;
    } else {
      leaderboard.entries = leaderboard.entries.concat(leaderboardData.entries);
    }

    if (leaderboardData.entries.length < 200) {
      break;
    }

    page += 1;
  }

  const updatedSegment = segment;
  updatedSegment.leaderboard = leaderboard || [];

  return updatedSegment;
}

function countEntries(segment) {
  const updatedSegment = segment;
  updatedSegment.entriesLast7Days = _.filter(segment.leaderboard.entries, e => moment(e.start_date) > moment().subtract(7, 'd')).length;
  updatedSegment.entriesLast30Days = _.filter(segment.leaderboard.entries, e => moment(e.start_date) > moment().subtract(30, 'd')).length;
  updatedSegment.entriesLast365Days = _.filter(segment.leaderboard.entries, e => moment(e.start_date) > moment().subtract(365, 'd')).length;
  return updatedSegment;
}

async function getArea(db, bounds, activityType, maxAge = 1) {
  const existingArea = await db.collection('areas').findOne({ bounds, activityType });
  if (existingArea && existingArea.created && moment(existingArea.created).isAfter(moment.subtract(maxAge, 'days'))) {
    console.log('return existing area from database');
    return existingArea;
  }

  // Get top segments in given bounding box
  const segmentsInArea = await getStravaSegmentsInArea(db, bounds, activityType);

  // Get segment details
  const segmentsWithLeaderboard = await Promise.all(segmentsInArea.map(segment => getLeaderboard(db, segment)));
  const segmentsWithEntryCounts = await Promise.all(segmentsWithLeaderboard.map(segment => countEntries(segment)));

  const newArea = {
    segments: segmentsWithEntryCounts,
    bounds,
    activityType,
    createdAt: new Date(),
  };

  await db.collection('areas').insertOne(newArea);
  return newArea;
}

const area = {
  type: AreaType,
  args: {
    north: {
      description: 'The northern border of the area.',
      type: FloatType,
    },
    west: {
      description: 'The western border the area.',
      type: FloatType,
    },
    south: {
      description: 'The southern border the area.',
      type: FloatType,
    },
    east: {
      description: 'The eastern border of the area.',
      type: FloatType,
    },
    activityType: {
      description: 'Type of segments to return. Values can be running or riding.',
      type: StringType,
    },
  },
  async resolve({ db }, { north, south, west, east, activityType = 'both' }) {
    const bounds = `${south},${west},${north},${east}`;
    const nullableActivityType = activityType === 'both' ? null : activityType;
    return getArea(db, bounds, nullableActivityType);
  },
};

export default area;
