const { basename, dirname } = require('path');
const glob = require('glob');

module.exports = ({ reportFilesGlob }) =>
  glob.sync(reportFilesGlob).map((path) => {
    const parentFolder = basename(dirname(path));
    if (parentFolder === 'coverage') {
      return { path, subdir: null };
    }
    return { path, subdir: parentFolder };
  });
