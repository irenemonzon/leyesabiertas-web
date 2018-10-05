import React from 'react'
import styled from 'styled-components'
import { ArticlesContext } from '../../containers/articles-container/component'

const StyledModeButton = styled.button`
  border: none;
  padding: 14px;
  margin-right: 20px;
  height: 45px;
  text-transform: uppercase;
  font-size: 1.4rem;
  color: #4a5d68;
  border-bottom: solid 1px #dae1e7;
  background-color: ${(props) => props.active ? '#f2f5f8' : 'white'};

`

const ModeButton = (props) => (
  <ArticlesContext.Consumer>
    {({ switchComments, withComments }) => (
      <StyledModeButton
        onClick={switchComments}
        active={props.withComments === withComments} {...props} />
    )}
  </ArticlesContext.Consumer>
)

export default ModeButton