const production = false; // toggle this (or use a build-time flag)

export const environment = {
  production,
  apiUrl: production
    ? 'https://mystudylist-backend-612429176168.europe-west1.run.app'
    : 'http://localhost:5000'
};