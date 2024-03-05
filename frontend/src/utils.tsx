const TOKEN_STORAGE: string = "session_token";

export async function send_json_backend(
  endpoint: string,
  body: string,
): Promise<any> {
  return fetch("http://100.64.94.171:3000" + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.text());
    }
    return response.json();
  });
}

export function get_session_token(): [number, number] | null {
  let data = sessionStorage.getItem(TOKEN_STORAGE);

  if (data == null) {
    redirect("/login/");
    return null;
  }
  return JSON.parse(data);
}

export function set_session_token(token: [number, number]) {
  sessionStorage.setItem(TOKEN_STORAGE, JSON.stringify(token));
}

export function logout() {
  sessionStorage.removeItem(TOKEN_STORAGE);
}

export function redirect(pathname: string) {
  window.location.pathname = pathname;
}
