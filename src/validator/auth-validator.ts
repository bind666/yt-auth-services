import { checkSchema } from 'express-validator';

export const userRegisterValidator = checkSchema({
  // Validate and sanitize email
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Please enter a valid email address',
    },
    normalizeEmail: true,
  },

  // Validate and sanitize name
  name: {
    in: ['body'],
    isString: {
      errorMessage: 'Name must be a string',
    },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'Name must be between 3 and 50 characters long',
    },
    trim: true, // Removes whitespace from the beginning and end
  },

  // Validate and sanitize password
  password: {
    in: ['body'],
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});
