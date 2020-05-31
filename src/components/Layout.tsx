import React from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background: #f1f2f5;
  }
  `;

const Wrapper = styled.div`
  width: 980px;
  margin: 100px auto;
  display: flex;
`;

const Side = styled.div`
  flex: 1;
  margin-left: 32px;
`;

const Main = styled.div`
  flex: 0;
`;

interface Props {
  main: React.ReactNode;
  side: React.ReactNode;
}

export function Layout(props: Props) {
  return (
    <Wrapper>
      <GlobalStyles />
      <Main>{props.main}</Main> <Side>{props.side}</Side>
    </Wrapper>
  );
}
