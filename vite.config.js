import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import openAiHandler from "./api/openai.js";
import sourceHandler from "./api/source.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function localApiPlugin() {
  const routes = {
    "/api/openai": openAiHandler,
    "/api/source": sourceHandler,
  };

  return {
    name: "local-vercel-api",
    configureServer(server) {
      Object.entries(routes).forEach(([route, handler]) => server.middlewares.use(route, async (req, res) => {
        try {
          req.body = await readJsonBody(req);
          const apiRes = {
            setHeader: (name, value) => res.setHeader(name, value),
            status: (code) => {
              res.statusCode = code;
              return apiRes;
            },
            json: (payload) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
            },
          };

          await handler(req, apiRes);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: { message: error?.message || "Local API error" } }));
        }
      }));
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
