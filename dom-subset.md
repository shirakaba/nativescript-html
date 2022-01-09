# What subset of DOM/jsdom is implemented?

[jsdom](https://github.com/jsdom/jsdom) implements more than just the DOM spec; it implements a broad amount of the Web platform (enough for testing a Web app usefully in a Node.js environment). While it would be really cool to implement the full set of APIs that jsdom implements so that one could possibly run Web code in NativeScript, it is far too big a task to consider. More than anything, it's not compelling until we have NativeScript Core equivalents to each of the HTML elements like `<div>`, which is again a huge obstacle.

To solidify how much work would be involved in implementing all of jsdom, here are all the Node.js standard libraries used by jsdom:

```
stream
bufferutil
utf
util
tty
path
http
https
url
fs
net
tls
assert
string_decoder
vm
zlib
os
child_process
canvas
buffer
crypto
```

So even if we did have equivalents for all of these libraries in NativeScript (we do have a few, to be fair!) ready-implemented, I feel that the extra weight that they would add to a project would be a turn-off for the low likelihood of them being put to any use.

Summarily: this project does not aim to implement the whole Web spec.

So what is in scope? Well, essentially every API that a DOM renderer (like React DOM) would need implemented. At a minimum, this reduces to:

* All of the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) APIs.
* All of the [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) APIs involved in adding/removing/inserting child nodes.
* A small number of the [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) APIs, for attributes and styles.

However, for DOM renderers that lack a custom renderer API (like Vue v2 and Svelte), some further APIs need shimming:

* A few [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) APIs like `createElement()`.
* A stand-in for the [`<body>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body) element.
* A stand-in for the [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) element.
* A stand-in for the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) element.
* A stand-in for the [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) object.

Apart from that, a few of the above APIs are actually really nice just to have as a developer, even if they're not required for the renderer in any way. `Element.prototype.outerHTML`, for example, can be really helpful for debugging the view tree. And there is a good chance that dev tools make use of APIs that the renderers wouldn't normally make use of.

Finally, if I see any APIs that look easy to include (the main disqualifying factor being if it relies upon a Node.js system API), I'll weigh them up!

See [src/jsdom/living/interfaces.js](src/jsdom/living/interfaces.js) for a high-level summary of what's implemented.
Search the codebase for the text `// NOT IMPLEMENTED` to find blocks of code that may have been modified to accommodate this.
