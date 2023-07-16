export const t = new Proxy(
  {},
  {
    get(target, property, receiver) {
      return (attrs, ...children) => {
        const el = document.createElement(property);
        for (let attr in attrs) {
          if (attrs[attr] !== false) {
            if (typeof attrs[attr] === 'function') {
              console.log('adding event listener', attr);
              el.addEventListener(attr, attrs[attr]);
            } else {
              el.setAttribute(attr, attrs[attr]);
            }
          }
        }
        if (children.length === 0) return el;
        for (let child of Array.isArray(children[0]) ? children[0] : children) {
          el.appendChild(
            typeof child === 'string' ? document.createTextNode(child) : child
          );
        }
        return el;
      };
    },
  }
);

// Creating elements with the SVG DOM
export const s = new Proxy(
  {},
  {
    get(target, property, receiver) {
      return (attrs, children) => {
        const el = document.createElementNS(
          'http://www.w3.org/2000/svg',
          property
        );
        for (let attr in attrs) {
          if (attrs[attr] !== false) {
            el.setAttribute(attr, attrs[attr]);
          }
        }
        if (children === undefined) return el;
        for (let child of Array.isArray(children) ? children : [children]) {
          el.appendChild(
            typeof child === 'string' ? document.createTextNode(child) : child
          );
        }
        return el;
      };
    },
  }
);
