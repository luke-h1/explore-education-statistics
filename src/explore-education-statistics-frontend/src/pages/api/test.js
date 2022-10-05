/* eslint-disable */
import TestComp from '@frontend/components/TestComp';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

const registry = createStyleRegistry();

export default function test(req, res) {
  const app = ReactDOMServer.renderToString(
    <StyleRegistry registry={registry}>
      <TestComp />
    </StyleRegistry>,
  );

  const styles = registry.styles();

  const html = ReactDOMServer.renderToStaticMarkup(
    <div>
      {styles}

      <div dangerouslySetInnerHTML={{ __html: app }} />
    </div>,
  );

  res.send(html);
}
