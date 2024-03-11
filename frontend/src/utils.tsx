const ID_STORAGE: string = "user_id";
const TOKEN_STORAGE: string = "session_token";

export async function send_json_backend<T>(
  endpoint: string,
  body: string,
): Promise<T> {
  const response = await fetch("http://localhost:3000" + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (!response.ok) {
    const text = await response.text();
    return Promise.reject(new Error(text));
  }

  return response.json();
}

export function get_session_token(): [number, number] | null {
  const data = sessionStorage.getItem(TOKEN_STORAGE);

  if (data == null) {
    redirect("/login/", []);
    return null;
  }
  return JSON.parse(data);
}

export function get_user_id(): number | null {
  const data = sessionStorage.getItem(ID_STORAGE);

  if (data == null) {
    redirect("/login/", []);
    return null;
  }
  return JSON.parse(data);
}

export function set_session_info(token: [number, number], user_id: number) {
  sessionStorage.setItem(TOKEN_STORAGE, JSON.stringify(token));
  sessionStorage.setItem(ID_STORAGE, JSON.stringify(user_id));
}

export function logout() {
  sessionStorage.removeItem(TOKEN_STORAGE);
}

export function redirect(pathname: string, params: [string, string][]) {
  const url = new URL(window.location.href);

  url.pathname = pathname;

  params.forEach((x) => {
    url.searchParams.append(x[0], x[1]);
  });

  window.location.href = url.toString();
}

export function get_param<T>(param: string): T | null {
  const url = new URL(window.location.href);
  const paramJson = new URLSearchParams(url.search).get(param);
  return paramJson ? JSON.parse(paramJson) : null;
}
