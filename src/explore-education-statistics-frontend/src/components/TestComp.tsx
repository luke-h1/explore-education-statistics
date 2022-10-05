import React from 'react';
import css from 'styled-jsx/css';

const styles = css`
  .heading {
    color: #1a9aef;
  }

  .thing {
    background: #00703c;
  }
`;

export default function TestComp() {
  return (
    <div>
      <h1 className="heading">Hey</h1>

      <div className="thing">
        <p>asdfasdfs</p>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
