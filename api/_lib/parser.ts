import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest, Theme } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname = "/", query = {} } = parse(req.url || "", true);
  const { fontSize, images, widths, heights, theme } = query;

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }
  if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }

  const arr = pathname.slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    md: true,
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights)
  };
  parsedRequest.images = getDefaultImages(
    parsedRequest.images,
    parsedRequest.theme
  );
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string): string[] {
  return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

function getDefaultImages(images: string[], theme: Theme): string[] {
  if (
    images.length > 0 &&
    images[0] &&
    images[0].startsWith(
      "https://assets.zeit.co/image/upload/front/assets/design/"
    )
  ) {
    return images;
  }
  return theme === "light"
    ? [
        "https://cdn.nakanapie.pl/assets/logo/nakanapie-nm-ff057b2b631c60a43276a65f6039adf51ee8cd4b116131087644e81ee11894e7.svg"
      ]
    : [
        "https://assets.zeit.co/image/upload/front/assets/design/zeit-white-triangle.svg"
      ];
}
