const { defineConfig } = require("cypress");

const cypressSplit = require("cypress-split")

module.exports = defineConfig({
  viewportHeight: 1024,
  viewportWidth: 1700,
  e2e: {
    // baseUrl: 'https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html',
    fixturesFolder: false,
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      return config
    }
  },
})
