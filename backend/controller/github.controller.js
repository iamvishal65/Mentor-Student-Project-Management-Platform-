import {
  userAllowed,
  encryptToken,
  saveAccessToken,
  getAccessTokenByUserId,
  decryptToken,
} from "../services/github.service.js";

async function exchangeToken(req, res) {
  try {
    const code = req.query.code;
    
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.GITHUB_REDIRECT_URI,
        }),
      },
    );

    const data = await response.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "GitHub token not received", data });
    }
    const encryptedToken = encryptToken(accessToken);

    saveAccessToken(req.token.id, encryptedToken);

    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function redirect(req, res) {
  try {
    const url =
      "https://github.com/login/oauth/authorize" +
      "?client_id=" +
      process.env.GITHUB_CLIENT_ID +
      "&scope=repo" +
      "&redirect_uri=" +
      process.env.GITHUB_REDIRECT_URI;

    res.redirect(url);
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

async function checkConnection(req, res) {
  try {
    const userId = req.token.id;
    if (!userId) return res.status(401).json({ message: "invalid token" });
    const check = await userAllowed(userId);
    if (!check) return res.json({ connected: false });
    else return res.json({ connected: true });
  } catch (err) {
    if(err.status==403)res.status(403).json({ message: err });
    else res.status(500).json({ message: err });
  }
}

async function getGithubRepos(req, res) {
  let accessToken;
  try {
    const userId = req.token.id;
    
    const encryptedTokenObj = await getAccessTokenByUserId(userId);
    if (!encryptedTokenObj) {
      return res.status(401).json({ message: "GitHub not connected" });
    }
    const { accessTokenEnc, iv, authTag } = encryptedTokenObj;
    if (!accessTokenEnc || !iv || !authTag) {
      return res
        .status(500)
        .json({ message: "Malformed encrypted token data" });
    }

    accessToken = decryptToken(accessTokenEnc, iv, authTag);

    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    const repos = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(repos);
    }

    const repoNames = repos.map((repo) => ({
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
    }));
    
    res.json(repoNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { checkConnection, redirect, exchangeToken, getGithubRepos };
