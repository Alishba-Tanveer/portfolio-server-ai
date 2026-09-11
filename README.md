# Portfolio chat backend

This tiny server is the only thing allowed to hold your OpenAI API key. Your
static site (GitHub Pages) calls this server; this server calls OpenAI.
The key never appears in any file that reaches the browser.

## First, deal with the leaked key

If you were given a key by your friend that got typed into a chat, that
key is compromised — treat it as public. Your friend should revoke it at
platform.openai.com/api-keys and generate a new one. You should get your
**own** key from your **own** OpenAI account (platform.openai.com → API
keys → Create new secret key) so your usage and billing are separate from
hers.

## Deploy this to Render (free tier)

1. Push this whole `chat-server` folder to its own GitHub repo (or a
   subfolder of one — Render lets you set a "root directory").
2. Go to render.com → sign up/log in → **New → Web Service**.
3. Connect the repo. Set:
   - **Root directory:** `chat-server` (if it's a subfolder)
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Under **Environment**, add a variable:
   - Key: `OPENAI_API_KEY`
   - Value: your real key (starts with `sk-`)
5. Deploy. Render gives you a URL like
   `https://your-app-name.onrender.com`.
6. Test it's alive by visiting that URL in a browser — you should see
   "Alishba's portfolio chat backend is running."

## Connect it to your portfolio

Open `js/chat-widget.js` in your portfolio and find this line near the top:

```js
const CHAT_API_URL = "PASTE_YOUR_RENDER_URL_HERE/api/chat";
```

Replace it with your real Render URL, e.g.:

```js
const CHAT_API_URL = "https://your-app-name.onrender.com/api/chat";
```

Commit and push your portfolio changes. The chat widget will now talk to
your live backend.

## Notes

- **Free Render services sleep after inactivity** — the first message
  after a quiet period can take 10-30 seconds to respond while it wakes
  up. The widget shows a "Typing..." indicator the whole time, so this is
  expected, not a bug.
- **Locking down CORS:** right now the server accepts requests from any
  origin (`app.use(cors())`). Once your site is live, tighten this in
  `index.js` to only your real domain, e.g.:
  ```js
  app.use(cors({ origin: "https://alishba-tanveer.github.io" }));
  ```
- **Cost:** `gpt-4o-mini` is inexpensive, but it's still metered usage on
  whoever's API key is configured. Keep an eye on usage at
  platform.openai.com/usage.
