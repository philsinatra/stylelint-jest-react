import React from 'react';
import styled from '@emotion/styled';

const StyledHeader = styled.header`
  width: 100%;
  min-height: 100vh;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledH1 = styled.h1`
  font-size: 2re;
`;

const Header = (props) => (
  <StyledHeader>
    <StyledH1>{props.children}</StyledH1>
  </StyledHeader>
);

export default Header;
