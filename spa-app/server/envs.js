const os = require('os');
const isLocal = os.hostname().endsWith('.local');

module.exports = { isLocal };

if (require.main === module) {
  console.info(module.exports);
}
