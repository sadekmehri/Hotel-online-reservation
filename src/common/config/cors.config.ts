export const corsOptions = {
  origin: [process.env.APP_FRONT_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Access-Control-Allow-Headers',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'x-auth-token',
  ],
}
