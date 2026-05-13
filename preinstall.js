const fs = require('fs');
for (const file of ['package-lock.json', 'yarn.lock']) {
  try {
    fs.unlinkSync(file);
  } catch (error) {
    // ignore missing files
  }
}
