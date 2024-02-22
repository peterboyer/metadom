import type { Atom } from ".";
import { listen } from "./atom";

declare global {
  module JSX {
    // type IntrinsicElements = {
    //   [TagName in keyof HTMLElementTagNameMap]: Record<never, never>;
    // };
    type IntrinsicElements = {
      div: Record<never, never>;
      button: { onclick: () => void };
    };
    type Element = {
      _type: "element";
      name: string;
      props: Record<string, string>;
      children: (string | JSX.Element | Atom)[];
      node: Node;
    };
  }
}

export type Component = () => JSX.Element;

export const jsx = (
  name: string,
  props: Record<string, string>,
  ...children: (string | JSX.Element | Atom)[]
): JSX.Element => {
  console.log(name, props, children);
  const node = document.createElement(name);
  Object.assign(node, props);

  const nodeChildren: (string | Node)[] = [];
  children.forEach((child, index) => {
    if (child === null) {
      return;
    }
    if (typeof child === "object" && child._type === "element") {
      nodeChildren.push(child.node);
    } else if (typeof child === "function" && child._type === "atom") {
      const render = () => `${child()}`;
      const { result, atoms } = listen(() => render());
      atoms.forEach((atom) =>
        atom.callbacks.push(() => {
          const child = node.childNodes[index];
          if (child) {
            child.textContent = render();
          }
        }),
      );
      nodeChildren.push(result);
    } else {
      nodeChildren.push(child);
    }
  });
  if (nodeChildren.length) {
    node.append(...nodeChildren);
  }

  const element = {
    _type: "element" as const,
    name,
    props,
    children,
    node,
  };

  return element;
};
