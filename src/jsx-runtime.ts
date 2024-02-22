declare global {
  module JSX {
    type IntrinsicElements = Record<
      keyof HTMLElementTagNameMap,
      Record<never, never>
    >;
    type Element = {
      name: string;
      props: Record<string, string>;
      children: string[];
      node: Node;
    };
  }
}

export type Component = () => JSX.Element;

export const jsx = (
  name: string,
  props: Record<string, string>,
  ...children: string[]
): JSX.Element => {
  const node = document.createElement(name);
  node.append(...children);
  const element = {
    name,
    props,
    children,
    node,
  };
  return element;
};
