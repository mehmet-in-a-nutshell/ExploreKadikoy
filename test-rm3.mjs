import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const text = "## Mekan 2\n\nSome text here.";

console.log('Result:', renderToString(React.createElement(ReactMarkdown, {remarkPlugins: [remarkGfm]}, text)));
