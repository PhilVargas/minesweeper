let JS_BASE_DIR,
    STYLES_BASE_DIR,
    STYLES_DEPLOY_DIR,
    JS_DEPLOY_DIR,
    SASS_BASE_DIR,
    VENDOR_ROOT;

JS_BASE_DIR = 'app/js';
STYLES_BASE_DIR = 'assets/css';
JS_DEPLOY_DIR = 'dist/app/js';
STYLES_DEPLOY_DIR = 'dist/assets/css';
SASS_BASE_DIR = 'assets/css/sass';
VENDOR_ROOT = 'node_modules';

function displayError(error){
  let errorMessage;

  errorMessage = `[${error.constructor.name}] ${error.message}\n${error.codeFrame}`;
  console.error(errorMessage);
}

module.exports = {
  build: JS_BASE_DIR,
  displayError,
  entries: ['index.js'],
  includes: [
    './',
    './app/**'
  ],
  stylesRoot: STYLES_BASE_DIR,
  sassRoot: SASS_BASE_DIR,
  stylesDeployRoot: STYLES_DEPLOY_DIR,
  sassFiles: `${SASS_BASE_DIR}/**/*.scss`,
  jsFiles: [
    `${JS_BASE_DIR}/**/*.js`,
    `!${JS_BASE_DIR}/bundle.js`
  ],
  jsRoot: JS_BASE_DIR,
  jsDeployRoot: JS_DEPLOY_DIR,
  jsVendor: VENDOR_ROOT,
  root: JS_BASE_DIR
};
