import { listen } from "./atom";

const events = ["onclick"] satisfies (keyof HTMLElement)[];
function isEventKey(key: string): key is (typeof events)[number] {
  return events.includes(key as any);
}

declare global {
  module JSX {
    type IntrinsicElements = {
      [TagName in keyof HTMLElementTagNameMap]: {
        id?: string;
        class?: string;
        onclick?: NonNullable<HTMLElement["onclick"]>;
        [key: string]: unknown;
      };
    };

    type Element = {
      node: Node;
    };
  }
}

type AnyProps = Record<string, unknown>;
type IntrinsicProps = JSX.IntrinsicElements[keyof JSX.IntrinsicElements];
type Children = (null | JSX.Element | (() => null | JSX.Element))[];

export type Component = () => JSX.Element;

type JSXArgs = JSXArgs.Intrinsic | JSXArgs.Function;
namespace JSXArgs {
  export type Intrinsic = [
    tag: string,
    props: IntrinsicProps | null,
    ...children: Children,
  ];
  export type Function = [
    tag: (props: AnyProps) => JSX.Element,
    props: AnyProps | null,
    ...children: Children,
  ];
}

export const jsx = (...args: JSXArgs): JSX.Element => {
  console.debug("jsx", args);

  let node: Node;
  const [, , ...children] = args;
  if (typeof args[0] === "string") {
    const [tag, props] = args as JSXArgs.Intrinsic;
    node = document.createElement(tag);
    if (props) {
      for (const key in props) {
        if (isEventKey(key)) {
          const type = key.substring(2);
          const callback = props[key];
          if (callback) {
            node.addEventListener(type, callback as any);
          }
        }
      }
    }
  } else {
    const [tag, props] = args as JSXArgs.Function;
    node = tag(props ?? {}).node;
  }

  const nodeChildren: (string | Node)[] = [];
  children.forEach((child, index) => {
    if (child === null) {
      return;
    }
    if (typeof child === "object") {
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
  if (node instanceof Element && nodeChildren.length) {
    node.append(...nodeChildren);
  }

  return {
    node,
  };
};
