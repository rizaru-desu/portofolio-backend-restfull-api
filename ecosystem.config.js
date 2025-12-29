module.exports = {
  apps: [
    {
      name: 'be-portfolio',
      script: './dist/src/main.js', // Arahkan ke file hasil build NestJS
      instances: '1', // "max" jika ingin pakai semua core CPU, atau angka "1"
      exec_mode: 'fork', // "cluster" jika instances > 1
      autorestart: true,
      watch: false, // Jangan true di production
      max_memory_restart: '1G', // Restart otomatis jika RAM tembus 1GB
    },
  ],
};
