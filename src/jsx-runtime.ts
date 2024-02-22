import type { Atom } from ".";
import { listen } from "./atom";

declare global {
  module JSX {
    type IntrinsicElements = {
      div: Record<never, never>;
      button: { onclick: () => void };
    } & {
      [TagName in keyof HTMLElementTagNameMap]: Record<never, never>;
    };
    type Element = {
      _type: "element";
      name: string;
      props: Record<string, string> | null;
      children: (string | Element | Atom)[];
      node: Node;
    };
  }
}

export type Component = () => JSX.Element;

export const jsx = (
  name: JSX.Element["name"],
  props: JSX.Element["props"],
  ...children: JSX.Element["children"]
): JSX.Element => {
  console.log(name, props, children);
  const node = document.createElement(name);
  if (props) {
    const { class: className, ...otherProps } = props;
    Object.assign(node, otherProps, { className });
  }

  const nodeChildren: (string | Node)[] = [];
  children.forEach((child, index) => {
    if (child === null) {
      return;
    }
    if (typeof child === "object" && child._type === "element") {
      nodeChildren.push(child.node);
    } else if (typeof child === "function") {
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

  const element: JSX.Element = {
    _type: "element" as const,
    name,
    props,
    children,
    node,
  };

  return element;
};
