const crypto = require('crypto');

crypto.randomBytes(64, (err, buf) => {  // 멀티스레딩으로 동작. 단방향.
    const salt = buf.toString('base64');
    console.log('salt:', salt);
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password:', key.toString('base64'));
    });
});