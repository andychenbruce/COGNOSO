export async function send_json(
  endpoint: string,
  body: string,
): Promise<String> {
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
    let output: Promise<String> = response.json();
    return output;
  });
}

function get_session_token(): [number, number] | null {
  let data = sessionStorage.getItem("key");

  if (data == null) {
    return null;
  }
  return JSON.parse(data);
}
