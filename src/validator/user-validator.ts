import { checkSchema } from 'express-validator';

const paginationSchema = checkSchema({
  page: {
    in: ['query'], // The `page` parameter is expected to come from the query string.
    isInt: {
      errorMessage: 'Page must be a number.',
      options: { min: 1 }, // Page must be at least 1.
    },
    toInt: true, // Converts the value to an integer.
    optional: { options: { nullable: true } }, // Makes this parameter optional.
  },
  limit: {
    in: ['query'], // The `limit` parameter is also expected to come from the query string.
    isInt: {
      errorMessage: 'Limit must be a number.',
      options: { min: 1, max: 20 }, // Limit must be between 1 and 100.
    },
    toInt: true, // Converts the value to an integer.
    optional: { options: { nullable: true } }, // Makes this parameter optional.
  },
  order: {
    in: ['query'], // The `order` parameter comes from the query string.
    isIn: {
      options: [['asc', 'desc']], // Only allows 'asc' or 'desc' as valid values.
      errorMessage: 'Order must be either "asc" or "desc".',
    },
    optional: { options: { nullable: true } }, // Makes this parameter optional.
  },
});

export default paginationSchema;
