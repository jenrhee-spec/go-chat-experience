# Go chat experience prototype

Live preview: https://go-chat-experience.vercel.app/?chatScenario=email&knownRole=Product

This repository contains the editable React source and the built static site. The chat flow lives in `src/RecommendationStressChat.jsx`; the first-agent Report Builder questions live in `src/AgentSpotlightQuestionnaire.jsx`. The engineering framework is in `agent-recommendations-first-chat/`.

## Edit together

1. Clone the repository. Each person makes changes in a branch and opens a pull request.
2. To rebuild, install dependencies with `npm install`. This requires access to the private `@superhuman/origin` package.
3. Run `npm run build`. Commit your source edits **and** the generated `app.js`, `app.css`, and `index.html` files. The build updates the cache version in `index.html`.
4. Push the branch and review its Vercel preview. Merge to `main` to publish to the live site.

For a local preview, run `npm run serve` and open `http://localhost:8054/?chatScenario=email&knownRole=Product`.

Vercel serves the committed static files. Its deployment does not install Origin or rebuild the React source; a contributor with Origin access must run `npm run build` before merging. The `assets/` and `shared/` folders are included so deployments do not depend on the previous live site.

This is a prototype with sample data, not the production chat implementation.
