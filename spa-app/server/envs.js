const os = require('os');
let isLocal = os.hostname().endsWith('.local');

//isLocal=false;

module.exports = { isLocal };

if (require.main === module) {
  console.info(module.exports);
}
