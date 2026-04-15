import { getToken } from "./authenticate";

function authHeaders() {
  const token = getToken();
  return {
    Authorization: `JWT ${token}`,
    "Content-Type": "application/json",
  };
}

export async function addToFavourites(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/favourites/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );
  if (res.status === 200) {
    return res.json();
  }
  return [];
}

export async function removeFromFavourites(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/favourites/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );
  if (res.status === 200) {
    return res.json();
  }
  return [];
}

export async function getFavourites() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (res.status === 200) {
    return res.json();
  }
  return [];
}
