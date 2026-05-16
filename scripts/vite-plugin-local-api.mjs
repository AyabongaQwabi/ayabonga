import { loadEnv } from 'vite';

function readRequestBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function hydrateProcessEnv(mode, root) {
  const fromVite = loadEnv(mode, root, '');
  for (const [key, value] of Object.entries(fromVite)) {
    if (value !== undefined && value !== '') {
      process.env[key] = value;
    }
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
}

/** Serves /api/send during `npm run dev` (Vite has no serverless runtime). */
export function localApiPlugin() {
  let envChecked = false;

  return {
    name: 'local-api',
    configureServer(server) {
      hydrateProcessEnv(server.config.mode, server.config.root);

      if (!envChecked) {
        envChecked = true;
        if (!process.env.RESEND_API_KEY?.trim()) {
          console.warn(
            '\n[local-api] RESEND_API_KEY is not set. Quote emails will fail until you add it to .env.local and restart.\n',
          );
        } else if (process.env.NODE_ENV === 'development') {
          console.log('[local-api] /api/send ready (Resend configured)\n');
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0];
        if (pathname !== '/api/send') {
          return next();
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          hydrateProcessEnv(server.config.mode, server.config.root);
          const raw = await readRequestBody(req);
          const parsed = raw ? JSON.parse(raw) : null;
          const mod = await server.ssrLoadModule('/api/lib/handleQuoteSend.ts');
          const result = await mod.handleQuoteSend(mod.parseQuoteSendBody(parsed));
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.body));
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[local-api] /api/send failed:', err);
          }
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error:
                'Quote API failed in dev. Check the terminal and that RESEND_API_KEY is in .env.local.',
            }),
          );
        }
      });
    },
  };
}
