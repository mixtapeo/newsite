import React from 'react';
import styled from 'styled-components';

export default function CreditsTxt() {
  const content = `
            github
                  href="https://github.com/ShizukuIchi"
            site
                  href="https://sh1zuku.csie.io"`;

  return (
    <Div>
      <StyledTextarea
        readOnly
        value={content}
        spellCheck={false}
        wordWrap={true}
        aria-label="credits.txt"
      />
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledTextarea = styled.textarea`
  flex: auto;
  outline: none;
  font-family: 'Lucida Console', monospace;
  font-size: 13px;
  line-height: 14px;
  resize: none;
  padding: 2px;
  ${props => (props.wordWrap ? '' : 'white-space: nowrap; overflow-x: scroll;')}
  overflow-y: scroll;
  border: 1px solid #96abff;
`;
