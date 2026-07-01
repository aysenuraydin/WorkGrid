// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from "util";

// Jest ortamına tanımla
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as any;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as any;
}

if (typeof global.ReadableStream === "undefined") {
  // Node 18+ içinde aslında var ama JSDOM testlerinde çıkmayabiliyor
  global.ReadableStream = require("stream/web").ReadableStream;
}

Object.assign(global, { TextEncoder, TextDecoder });
