import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

const result = renderToString(React.createElement(ReactMarkdown, null, '\n## Mekan 2'));
console.log(result);
