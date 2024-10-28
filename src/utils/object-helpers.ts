export function getNestedProperty(obj: any, path: string): any {
  const keys = path.split(".");
  return keys.reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
}
``;

export function extractTitleAndDescription(content: string) {
  // ---Title: nice code---
  // ---Description: nicer code block---
  const lines = content.split("\n");
  const inferredLabels = lines.reduce(
    (acc, line: string) => {
      if (line.includes("---Title")) {
        const [k, v] = line.split("---Title");
        acc["title"] = v.trim().replace("---", "").replace(":", "");
      }
      if (line.includes("---Description")) {
        const [k, v] = line.split("---Description");
        acc["description"] = v.trim().replace("---", "").replace(":", "");
      }

      return acc;
    },
    { title: "Untitled", description: "" }
  );
  const linesWithoutTitleAndDescription = lines
    .filter((item) => {
      if (item.includes("---Title") || item.includes("---Description")) {
        return false;
      }
      return true;
    })
    .join("\n");
  return { ...inferredLabels, content: linesWithoutTitleAndDescription };
}
