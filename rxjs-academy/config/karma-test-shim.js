require('rxjs/Rx');

const appContext = require.context('../test', true, /\.spec\.ts/);

appContext.keys().forEach(appContext);
