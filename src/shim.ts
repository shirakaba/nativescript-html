/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { JSDOM } from "jsdom";
import { defineElements } from "./defineElements";

export function shim(): void {
  const { window } = new JSDOM(
    ``,
    {
      url: "https://nativescript.org/",
      referrer: "https://nativescript.org/",
      contentType: "text/html",
      includeNodeLocations: true,
    }
  );
  defineElements(window);
}
