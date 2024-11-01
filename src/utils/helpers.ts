import { OnePublishTarget } from "@/store/one-publish-targets-store";
import { PublishForm } from "@/store/publish-form-store";

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

export function addBaseUrlToUrl(url: string, baseUrl?: string) {
  if (!baseUrl) {
    return url;
  }
  if (url.trim().startsWith("http")) {
    return url;
  }
  return new URL(url, baseUrl).toString();
}

export function mapFieldsToValues(
  formdata: PublishForm,
  oneTarget: OnePublishTarget
): OnePublishTarget {
  if (!oneTarget || !formdata || !oneTarget?.mappings) {
    return oneTarget;
  }
  return Object.entries(oneTarget?.mappings).reduce(
    (acc, [key, value], idx) => {
      const mapTo = value.split(".");
      switch (key) {
        case "formData.title":
          // @ts-expect-error
          acc[mapTo[0]] = {
            // @ts-expect-error
            ...acc[mapTo?.[0]],
            [mapTo[1]]: formdata.title,
          };
          break;
        case "formData.description":
          // @ts-expect-error
          acc[mapTo[0]] = {
            // @ts-expect-error
            ...acc[mapTo?.[0]],
            [mapTo[1]]: formdata.description,
          };
          break;
        case "formData.content":
          // @ts-expect-error
          acc[mapTo[0]] = {
            // @ts-expect-error
            ...acc[mapTo?.[0]],
            [mapTo[1]]: formdata.content,
          };
          break;
        default:
          // @ts-expect-error
          acc[mapTo[0]] = {
            // @ts-expect-error
            ...acc[mapTo?.[0]],
            [mapTo[1]]: getNestedProperty(oneTarget, value),
          };
          break;
      }
      return acc;
    },
    { ...oneTarget }
  );
}
