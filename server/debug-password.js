// Debug password hashing
const bcrypt = require('bcryptjs');

async function debugPassword() {
  try {
    const password = 'adminpass';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Hash:', hash);
    
    // Test comparison
    const match1 = await bcrypt.compare(password, hash);
    console.log('Direct bcrypt compare:', match1);
    
    // Test with different salt
    const salt2 = await bcrypt.genSalt(10);
    const hash2 = await bcrypt.hash(password, salt2);
    const match2 = await bcrypt.compare(password, hash2);
    console.log('Different salt compare:', match2);
    
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

debugPassword(); 