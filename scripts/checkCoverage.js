#!/usr/bin/env node
/* eslint no-console: off */

const { resolve } = require('path');
const { readJsonSync } = require('fs-extra');
const {
  createCoverageMap,
  createCoverageSummary,
} = require('istanbul-lib-coverage');
const { createContext } = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const { getConfig, findReportFiles } = require('./utils');

const cwd = process.cwd();

const coverageDir = resolve(cwd, 'coverage');
const reportDir = resolve(coverageDir, 'report');

(async () => {
  const config = getConfig();
  const coverageMap = createCoverageMap({});
  const summary = createCoverageSummary();
  const reportFiles = findReportFiles(config);
  if (reportFiles.length === 0) {
    throw new Error(
      `No report files found for ${config.reportFilesGlob} – did you forget to run tests with coverage?`
    );
  }

  reportFiles.forEach(({ path }) => coverageMap.merge(readJsonSync(path)));

  coverageMap.files().forEach((file) => {
    const fileCoverage = coverageMap.fileCoverageFor(file);
    const currentSummary = fileCoverage.toSummary();
    summary.merge(currentSummary);
  });

  const {
    data: { lines, statements, functions, branches },
  } = summary;
  if (lines.total === 0) {
    throw new Error(
      `Total number of lines covered is 0 – there seems to be something wrong with your test setup`
    );
  }

  console.log(`TEST COVERAGE SUMMARY${
    reportFiles.length > 1
      ? ` (combining ${reportFiles
          .map(({ subdir }) => subdir || 'coverage root dir')
          .join(' + ')})`
      : ''
  }
┌────────────┬────────────┬────────────┬────────────┐
│            │ Total      │ Covered    │ Percentage │
├────────────┼────────────┼────────────┼────────────┤
│ Lines      │ ${`${lines.total}`.padStart(10)} │ ${`${lines.covered}`.padStart(
    10
  )} │ ${`${lines.pct.toFixed(2)}`.padStart(9)}% │
├────────────┼────────────┼────────────┼────────────┤
│ Statements │ ${`${statements.total}`.padStart(
    10
  )} │ ${`${statements.covered}`.padStart(10)} │ ${`${statements.pct.toFixed(
    2
  )}`.padStart(9)}% │
├────────────┼────────────┼────────────┼────────────┤
│ Functions  │ ${`${functions.total}`.padStart(
    10
  )} │ ${`${functions.covered}`.padStart(10)} │ ${`${functions.pct.toFixed(
    2
  )}`.padStart(9)}% │
├────────────┼────────────┼────────────┼────────────┤
│ Branches   │ ${`${branches.total}`.padStart(
    10
  )} │ ${`${branches.covered}`.padStart(10)} │ ${`${branches.pct.toFixed(
    2
  )}`.padStart(9)}% │
└────────────┴────────────┴────────────┴────────────┘`);

  const contextOptions = {
    defaultSummarizer: 'nested',
    watermarks: config.watermarks,
    coverageMap,
  };

  const htmlReport = reports.create('html');
  await htmlReport.execute(
    createContext({
      ...contextOptions,
      dir: reportDir,
    })
  );

  const lcovReport = reports.create('lcov');
  await lcovReport.execute(
    createContext({
      ...contextOptions,
      dir: coverageDir,
    })
  );

  console.info(`Coverage report: ${reportDir}/index.html`);

  // fail script if test coverage is below threshold
  const errorMessages = [];
  Object.entries(config.threshold).forEach(([type, threshold]) => {
    if (summary.data[type].pct < threshold) {
      errorMessages.push(
        `${type} coverage is below threshold of ${threshold}%`
      );
    }
  });

  if (errorMessages.length > 0) {
    throw new Error(
      `Test coverage check failed for the following reason${
        errorMessages.length === 1 ? '' : 's'
      }: ${errorMessages.join('; ')}`
    );
  }
})();
