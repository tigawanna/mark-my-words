import type { PostTarget } from "../../../extension/utils/config-manager.ts";

export async function makeFetchRequest(target: PostTarget) {
    const res = await fetch(target.endpoint, {
      method: target.method,
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        ...target.headers,
      },
      body: JSON.stringify(target.body),
    });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  console.log(" ======  response  ==== ", data);
  return data;
}
