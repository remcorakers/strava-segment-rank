import strava from 'strava-v3';
import moment from 'moment';
import _ from 'lodash';

import {
  GraphQLFloat as FloatType,
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
  const args = { id: segmentId, per_page: 200, page };
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

async function getStravaSegmentsInArea(db, bounds) {
  const args = { bounds, activity_type: 'running' };
  const cachedResult = await getStravaCallFromCache(db, 'explore', args);
  if (cachedResult) {
    return cachedResult;
  }

  const result = await new Promise((resolve, reject) => {
    strava.segments.explore(args, (err, res) => {
      if (err) {
        reject(new Error(err));
      }
      console.log(`fetched explore for bounds ${bounds}`);
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

    if (leaderboardData.entries.length === 0) {
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
  updatedSegment.leaderboard = leaderboard;

  return updatedSegment;
}

function countEntries(segment) {
  const updatedSegment = segment;
  updatedSegment.entriesLast7Days = _.filter(segment.leaderboard.entries, e => moment(e.start_date) > moment().subtract(7, 'd')).length;
  updatedSegment.entriesLast30Days = _.filter(segment.leaderboard.entries, e => moment(e.start_date) > moment().subtract(30, 'd')).length;
  updatedSegment.entriesLast365Days = _.filter(segment.leaderboard.entries, e => moment(e.start_date) > moment().subtract(365, 'd')).length;
  return updatedSegment;
}

async function getArea(db, bounds, forceUpdate = false) {
  const existingArea = await db.collection('areas').findOne({ bounds });
  if (existingArea && !forceUpdate) {
    return existingArea;
  }

  // Get top segments in given bounding box
  const segmentsInArea = await getStravaSegmentsInArea(db, bounds);

  // Get segment details
  const segmentsWithLeaderboard = await Promise.all(segmentsInArea.map(segment => getLeaderboard(db, segment)));

  const segmentsWithEntryCounts = await Promise.all(segmentsWithLeaderboard.map(segment => countEntries(segment)));

  const newArea = {
    segments: segmentsWithEntryCounts,
    bounds,
    createdAt: new Date(),
  };

  await db.collection('areas').insertOne(newArea);
  return newArea;
}

const area = {
  type: AreaType,
  args: {
    lat: {
      description: 'The latitude of the area.',
      type: FloatType,
    },
    lng: {
      description: 'The longitude of the area.',
      type: FloatType,
    },
  },
  async resolve({ db }, { lat, lng }) {
    const latConst = 0.005;
    const lngConst = 0.01;
    const bounds = `${lat - latConst},${lng - lngConst},${lat + latConst},${lng + lngConst}`;
    return getArea(db, bounds);
  },
};

export default area;
