
const crypto = require('crypto');

function generateDeterministicId(obj) {
  
  const parts = [
    (obj.project_name || '').trim(),
    (obj.registry || '').trim(),
    String(obj.vintage || ''),
    String(obj.quantity || '')
  ];
  if (obj.serial_number) parts.push(String(obj.serial_number));
  const str = parts.join('|'); // delimiter
  return crypto.createHash('sha256').update(str).digest('hex');
}

module.exports = { generateDeterministicId };
