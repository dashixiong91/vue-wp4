const os = require('os');

const isLocal = os.hostname().endsWith('.local');

// isLocal=false;

module.exports = { isLocal };

if (require.main === module) {
  console.info(module.exports);
}
