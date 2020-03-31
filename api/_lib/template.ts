import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

// const rglr = readFileSync(`${__dirname}/../_fonts/open-sans.woff2`).toString(
//   "base64"
// );
// const bold = readFileSync(
//   `${__dirname}/../_fonts/open-sans-bold.woff2`
// ).toString("base64");
// const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
//   "base64"
// );

const backgroundImage = readFileSync(
  `${__dirname}/../_assets/86280.jpg`
).toString("base64");

function getCss(theme: string, fontSize: string) {
  let background = "white";
  let foreground = "black";
  // let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    // radial = "dimgray";
  }
  return `
    @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700|Open+Sans:400,700&display=block&subset=latin-ext');
    
    body {
        background: ${background};
        background-image:url(data:image/jpg;base64,${backgroundImage});
        background-repeat: no-repeat;
        background-size: cover; 
        
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        font-family: 'Merriweather';
        display: block;
    }

    code:before, code:after {
        // content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Open Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.4;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join("")}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "300") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
