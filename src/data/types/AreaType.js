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
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
import SegmentType from './SegmentType';

const AreaType = new ObjectType({
  name: 'Area',
  fields: {
    bounds: { type: new NonNull(StringType) },
    segments: { type: new List(SegmentType) },
  },
});

export default AreaType;
