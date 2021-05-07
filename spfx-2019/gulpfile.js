'use strict';

const path = require('path');
const typeScriptConfig = require('@microsoft/gulp-core-build-typescript/lib/TypeScriptConfiguration');
typeScriptConfig.TypeScriptConfiguration.setTypescriptCompiler(require('typescript'));

const buildtypescript = require('@microsoft/gulp-core-build-typescript');
buildtypescript.tslint.enabled = false;

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);



function includeRuleForSourceMapLoader(rules) {
    for (const rule of rules) {
      if (rule.use && typeof rule.use === 'string' && rule.use.indexOf('source-map-loader') !== -1) {
        rule.include = [path.resolve(__dirname, 'lib'), path.resolve(__dirname, 'node_modules', 'spfx-2019-lib')];
      }
    }
  }
  build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfiguration) => {
      //we dont like to include all source maps
      includeRuleForSourceMapLoader(generatedConfiguration.module.rules);
  

      return generatedConfiguration;
    }
  });
  build.initialize(require('gulp'));