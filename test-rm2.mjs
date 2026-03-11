import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

const text1 = "\n## Mekan 2";
const text2 = "  ## Mekan 2";
const text3 = "\r\n## Mekan 2";
const text4 = "\n\n## Mekan 2\n\n";

console.log('1:', renderToString(React.createElement(ReactMarkdown, null, text1)));
console.log('2:', renderToString(React.createElement(ReactMarkdown, null, text2)));
console.log('3:', renderToString(React.createElement(ReactMarkdown, null, text3)));
console.log('4:', renderToString(React.createElement(ReactMarkdown, null, text4)));
