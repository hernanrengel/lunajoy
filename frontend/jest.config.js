export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|@mui|@babel|@emotion|@hookform|@testing-library|@mui/icons-material|@mui/material|@mui/x-date-pickers|@mui/x-charts|@mui/lab|@mui/utils|@mui/system|@mui/private-theming|@mui/styled-engine|@mui/material/styles|@mui/material/colors|@popperjs|react-syntax-highlighter|d3-color|d3-format|d3-interpolate|d3-time|d3-time-format|internmap|react-is|scheduler|use-sync-external-store|uuid|yup))',
  ],
};
