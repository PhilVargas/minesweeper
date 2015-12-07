const JS_BASE_DIR = 'src';
const STYLES_BASE_DIR = 'styles';
const JS_DEPLOY_DIR = 'dist/src';
const STYLES_DEPLOY_DIR = 'dist/styles';
const SASS_BASE_DIR = 'styles/sass';
const VENDOR_ROOT = 'node_modules';

function displayError(error){
  let errorMessage;

  errorMessage = `[${error.constructor.name}] ${error.message}\n${error.codeFrame}`;
  console.error(errorMessage);
}

const config = {
  build: JS_BASE_DIR,
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

export { config as default, displayError };

