import { type Node } from '@/global/types';
import { slugify } from './slugify';

export const generateTableOfContent = (abstractSyntaxTree: Node[]): Node[] => {
  const outline: Node = { subheadings: [] };
  const headings = findHeadings(abstractSyntaxTree);
  const path: number[] = [];
  mapHeadings(headings, path, outline);
  return outline.subheadings || ([] as Node[]);
};

function findHeadings(abstractSyntaxTree: Node[]): Node[] {
  return filterNode(abstractSyntaxTree, (node) => /h\d/.test(node.style || '')).map((node) => {
    const text = getChildrenText(node);
    const slug = slugify(text);

    return { ...node, text, slug };
  });
}

function filterNode(abstractSyntaxTree: Node[], match: (node: Node) => boolean): Node[] {
  return abstractSyntaxTree.reduce((accumulator: Node[], node: Node) => {
    if (match(node)) accumulator.push(node);
    if (node.children) accumulator.push(...filterNode(node.children, match));
    return accumulator;
  }, []);
}

function getChildrenText({ children = [] }: Node): string {
  return children.map((node) => (typeof node === 'string' ? node : node.text || '')).join('');
}

function mapHeadings(headings: Node[], path: number[], outline: Node): Node[] {
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = Number(heading.style?.slice(1));
    heading.subheadings = [];

    if (level < lastLevel) for (let i = lastLevel; i >= level; i--) path.pop();
    else if (level === lastLevel) path.pop();

    const prop: Node = getProperty(outline, getObjectPath(path));
    prop.subheadings?.push(heading);
    path.push((prop.subheadings?.length || 0) - 1);
    lastLevel = level;
  });
  return headings;
}

function getObjectPath(path: number[]): string[] {
  return path.length === 0 ? [] : ['subheadings'].concat(path.join('.subheadings.').split('.'));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProperty(object: any, path: string[]): Node {
  return path.reduce((previous, current) => previous[current], object);
}
