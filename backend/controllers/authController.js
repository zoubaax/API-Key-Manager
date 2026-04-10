const { authClient, createUserScopedClient } = require("../services/supabase");
const { ensureProfile } = require("../services/profileService");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const { data, error } = await authClient.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data.user) {
      await ensureProfile(data.user);
    }

    return res.status(201).json({
      message: "Registration successful.",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email
          }
        : null,
      session: data.session
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user || !data.session) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const profile = await ensureProfile(data.user);

    return res.status(200).json({
      message: "Login successful.",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function googleAuth(req, res, next) {
  try {
    const redirectTo = `${process.env.APP_URL || "http://localhost:3000"}/auth/callback`;

    const { data, error } = await authClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true
      }
    });

    if (error || !data?.url) {
      return res.status(400).json({ error: error?.message || "Unable to start Google OAuth." });
    }

    return res.redirect(data.url);
  } catch (error) {
    return next(error);
  }
}

async function oauthCallback(req, res, next) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Missing OAuth authorization code." });
    }

    const { data, error } = await authClient.auth.exchangeCodeForSession(String(code));

    if (error || !data.user || !data.session) {
      return res.status(400).json({ error: error?.message || "OAuth login failed." });
    }

    const profile = await ensureProfile(data.user);

    return res.status(200).json({
      message: "Google OAuth successful.",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const client = createUserScopedClient(req.token);
    const { error } = await client.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  googleAuth,
  oauthCallback,
  logout
};
