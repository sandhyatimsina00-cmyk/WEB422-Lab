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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: user, password }),
  });
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: user, password, password2 }),
  });
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
