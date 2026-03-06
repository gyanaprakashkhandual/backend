import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║   Server is running successfully!      ║
  ║   Host: ${HOST.padEnd(33)}║
  ║   Port: ${String(PORT).padEnd(33)}║
  ║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(24)}║
  ╚════════════════════════════════════════╝

  Available Routes:
  ─────────────────────────────────────────
  📁 Projects:
     GET /api/projects
     GET /api/projects/:slug

  📚 Skills:
     GET /api/skills
     GET /api/skills/category/:category
     GET /api/skills/:skillName

  🎓 Education:
     GET /api/education
     GET /api/education/stream/:stream
     GET /api/education/institution/:institution
     GET /api/education/:title

  💼 Experience:
     GET /api/experience
     GET /api/experience/company/:company
     GET /api/experience/role/:role
     GET /api/experience/:slug

  🏥 Health Check:
     GET /api/health
  ─────────────────────────────────────────
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

export default server;