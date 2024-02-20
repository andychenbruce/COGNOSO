export async function send_json_backend(
  endpoint: string,
  body: string,
): Promise<any> {
  return fetch("http://localhost:3000" + endpoint, {
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
  let data = sessionStorage.getItem("session_token");

  if (data == null) {
    redirect("/login/");
    return null;
  }
  return JSON.parse(data);
}

export function set_session_token(token: [number, number]) {
  sessionStorage.setItem("session_token", JSON.stringify(token));
}

export function logout() {
  sessionStorage.removeItem("session_token");
}

export function redirect(pathname: string) {
  window.location.pathname = pathname;
}
