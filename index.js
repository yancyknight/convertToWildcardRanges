#!/usr/bin/env node

const fs = require('fs').promises;

(async function convertToWildcardRanges() {
  try {
    // Read package.json file
    const packageJson = await fs.readFile('./package.json', 'utf-8');
    const packageData = JSON.parse(packageJson);
    const { dependencies, devDependencies } = packageData;

    // Function to update version range format
    const updateVersionRange = (versionRange) => {
      if (versionRange.startsWith('~')) {
        // Update ~ case
        return versionRange.replace('~', '').replace(/\.\d+$/, '.x');
      } else if (versionRange.startsWith('^')) {
        // Update ^ case
        return versionRange.replace('^', '').replace(/\.\d+\.\d+$/, '.x.x');
      }
      return versionRange; // No change for other cases
    };

    // Loop through dependencies and devDependencies and update version ranges
    for (const dependencyArray of [dependencies, devDependencies]) {
      if(dependencyArray) {
        for (const key in dependencyArray) {
          if (dependencyArray.hasOwnProperty(key)) {
            const versionRange = dependencyArray[key];
            dependencyArray[key] = updateVersionRange(versionRange);
          }
        }
      }
    }

    // Write updated package.json file
    await fs.writeFile('./package.json', JSON.stringify(packageData, null, 2));
    console.log('Successfully updated package.json');
  } catch (error) {
    console.error('Failed to update package.json:', error);
  }
})();
