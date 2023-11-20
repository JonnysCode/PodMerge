# <img src="public/icons/icon_64.png" width="45" align="left"> PodMerge Browser Extension

> Make (Semantic) Web content collaboratively editable through CRDTs and a dedicated hypermedia controls vocabulary.

We introduce the PodMerge approach including the Collaborative Resource Description Ontology (CRDO) vocabulary for describing interactions with CRDT-based resources hosted in Solid Pods. This allows software clients to discover at run-time the required means for collaboratively editing the resources. You can use this PodMerge Chrome Extension to consume the discription and makes the Web blog's content and its Linked Data annotations collaboratively editablebthrough CRDTs ([Yjs](https://github.com/yjs/yjs), [Automerge](https://github.com/automerge/automerge)).

## Features

- **Collaborative Resource Description Ontology (CRDO):** Describe Web resources with hypermedia controls to enable collaboration on your website
- **Collaborative Linked Data Extension:** Users with this extensions can comsume the CRDO and collaborate in real-time on the Web content and Linked Data annotations of that content.
- **Use with Solid Pods:** If you use Solid Pods to store your data and description you can keep full control and add access control for readers and collaborators

## Getting Started

```sh
npm install
npm run dev
```

Runs the app and WebRTC signaling server in development mode.
Then follow these instructions to see your app:

1. Open chrome://extensions
2. Check the Developer mode checkbox
3. Click on the Load unpacked extension button
4. Select the folder .../PodMerge/build

Visit a website with a CRDO description, JSON(-LD) content, and data-path attribute and start collaborating.
An example site can be found here: [https://imp.inrupt.net/local-first/blog/](https://imp.inrupt.net/local-first/blog/)

## Contribution

Suggestions and pull requests are welcomed!.

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)
