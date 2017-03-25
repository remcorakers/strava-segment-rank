/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const SegmentType = new ObjectType({
  name: 'Segment',
  fields: {
    id: { type: new NonNull(ID) },
    name: { type: new NonNull(StringType) },
    distance: { type: new NonNull(FloatType) },
    entriesLast7Days: { type: new NonNull(IntType) },
    entriesLast30Days: { type: new NonNull(IntType) },
    entriesLast365Days: { type: new NonNull(IntType) },
  },
});

export default SegmentType;
