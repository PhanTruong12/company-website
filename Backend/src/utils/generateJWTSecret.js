// generateJWTSecret.js - Script để tạo JWT_SECRET mạnh
const crypto = require('crypto');

/**
 * Tạo JWT_SECRET ngẫu nhiên mạnh
 */
function generateJWTSecret() {
  // Tạo 32 bytes ngẫu nhiên và convert sang base64
  const secret = crypto.randomBytes(32).toString('base64');
  return secret;
}

// Tạo và hiển thị secret
const secret = generateJWTSecret();

console.log('\n' + '='.repeat(60));
console.log('🔐 JWT_SECRET GENERATOR');
console.log('='.repeat(60));
console.log('\n✅ JWT_SECRET đã được tạo:');
console.log('\n' + secret);
console.log('\n📝 Copy và thêm vào file .env:');
console.log('JWT_SECRET=' + secret);
console.log('\n⚠️  LƯU Ý:');
console.log('  - Giữ bí mật JWT_SECRET này');
console.log('  - Không commit lên Git');
console.log('  - Sử dụng secret khác nhau cho development và production');
console.log('='.repeat(60) + '\n');

