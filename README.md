# Portfolio chat backend (Vercel)

A single serverless function, `api/chat.js`. No server to keep running,
no sleep/cold-start server process, and Vercel's Hobby plan doesn't ask
for a card.

## Deploy

1. Replace the contents of your `portfolio-server-ai` repo with these
   files (delete the old `index.js`; keep this `api/chat.js` structure).
2. Commit and push:
   ```
   git add -A
   git commit -m "Switch to Vercel serverless function"
   git push
   ```
3. Go to vercel.com → sign up/log in with GitHub (no card needed for
   Hobby).
4. Click **Add New → Project**, select your `portfolio-server-ai` repo,
   click **Import**.
5. Before deploying, expand **Environment Variables** and add:
   - Key: `OPENAI_API_KEY`
   - Value: your real key
6. Click **Deploy**. Takes about 30-60 seconds.
7. Once live, Vercel gives you a URL like
   `https://portfolio-server-ai.vercel.app`. Your chat endpoint is at:
   ```
   https://portfolio-server-ai.vercel.app/api/chat
   ```

## Connect it to your portfolio

In `js/chat-widget.js`, set:

```js
const CHAT_API_URL = "https://portfolio-server-ai.vercel.app/api/chat";
```

Commit and push your portfolio. Done.

## Notes

- No card required on Vercel's Hobby plan for a project like this.
- Serverless functions "cold start" too (a short delay on the first
  request after inactivity), same idea as Render's sleep, just usually
  faster to wake.
- If you ever want to lock down CORS to just your domain, edit the
  `Access-Control-Allow-Origin` line in `api/chat.js`.
