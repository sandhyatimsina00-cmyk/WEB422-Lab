const TOKEN_KEY = "access_token";

export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function readToken() {
  try {
    const token = getToken();
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = readToken();
  if (!token) return false;
  const now = Math.floor(Date.now() / 1000);
  if (token.exp && token.exp < now) return false;
  return true;
}

export async function authenticateUser(user, password) {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  const loginUrl = `${base}/login`;
  // #region agent log
  {
    let sameOriginAsPage = null;
    if (typeof window !== "undefined" && base) {
      try {
        sameOriginAsPage = new URL(base).origin === window.location.origin;
      } catch {
        sameOriginAsPage = "invalid-base-url";
      }
    }
    fetch("http://127.0.0.1:7461/ingest/3a6e480d-5221-4f65-8eb6-7dae8fa53e9e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7b185b",
      },
      body: JSON.stringify({
        sessionId: "7b185b",
        hypothesisId: "H1",
        location: "authenticate.js:authenticateUser:pre",
        message: "login fetch about to start",
        data: {
          baseLen: base.length,
          basePrefix: base.slice(0, 96),
          pageOrigin:
            typeof window !== "undefined" ? window.location.origin : "ssr",
          sameOriginAsPage,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion
  let res;
  try {
    res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user, password }),
    });
  } catch (err) {
    // #region agent log
    fetch("http://127.0.0.1:7461/ingest/3a6e480d-5221-4f65-8eb6-7dae8fa53e9e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7b185b",
      },
      body: JSON.stringify({
        sessionId: "7b185b",
        hypothesisId: "H3",
        location: "authenticate.js:authenticateUser:catch",
        message: "login fetch threw",
        data: { name: err?.name, message: String(err?.message).slice(0, 200) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw err;
  }
  // #region agent log
  fetch("http://127.0.0.1:7461/ingest/3a6e480d-5221-4f65-8eb6-7dae8fa53e9e", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "7b185b",
    },
    body: JSON.stringify({
      sessionId: "7b185b",
      hypothesisId: "H4",
      location: "authenticate.js:authenticateUser:post",
      message: "login fetch response",
      data: { status: res.status, ok: res.ok },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const data = await res.json().catch(() => ({}));
  if (res.status === 200 && data.message?.token) {
    setToken(data.message.token);
    return true;
  }
  const msg =
    typeof data.message === "string"
      ? data.message
      : data.message?.message || "Login failed";
  throw new Error(msg);
}

export async function registerUser(user, password, password2) {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  const registerUrl = `${base}/register`;
  // #region agent log
  {
    let sameOriginAsPage = null;
    if (typeof window !== "undefined" && base) {
      try {
        sameOriginAsPage = new URL(base).origin === window.location.origin;
      } catch {
        sameOriginAsPage = "invalid-base-url";
      }
    }
    fetch("http://127.0.0.1:7461/ingest/3a6e480d-5221-4f65-8eb6-7dae8fa53e9e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7b185b",
      },
      body: JSON.stringify({
        sessionId: "7b185b",
        hypothesisId: "H2",
        location: "authenticate.js:registerUser:pre",
        message: "register fetch about to start",
        data: {
          baseLen: base.length,
          basePrefix: base.slice(0, 96),
          pageOrigin:
            typeof window !== "undefined" ? window.location.origin : "ssr",
          sameOriginAsPage,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion
  let res;
  try {
    res = await fetch(registerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user, password, password2 }),
    });
  } catch (err) {
    // #region agent log
    fetch("http://127.0.0.1:7461/ingest/3a6e480d-5221-4f65-8eb6-7dae8fa53e9e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7b185b",
      },
      body: JSON.stringify({
        sessionId: "7b185b",
        hypothesisId: "H3",
        location: "authenticate.js:registerUser:catch",
        message: "register fetch threw",
        data: { name: err?.name, message: String(err?.message).slice(0, 200) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw err;
  }
  // #region agent log
  fetch("http://127.0.0.1:7461/ingest/3a6e480d-5221-4f65-8eb6-7dae8fa53e9e", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "7b185b",
    },
    body: JSON.stringify({
      sessionId: "7b185b",
      hypothesisId: "H4",
      location: "authenticate.js:registerUser:post",
      message: "register fetch response",
      data: { status: res.status, ok: res.ok },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (res.status === 200) {
    return true;
  }
  const data = await res.json().catch(() => ({}));
  const msg =
    typeof data.message === "string"
      ? data.message
      : "Registration failed";
  throw new Error(msg);
}
