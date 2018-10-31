import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import WithUserContext from '../with-user-context/component'
import UserAvatar from '../../elements/user-avatar/component'

const StyledLoggedUser = styled.div`
  height:45px;
  display:flex;
  justify-content:flex-end;
  background: #fff;
  box-sizing: border-box;
  cursor: pointer;
`

const LoggedUser = (props) => (
  <StyledLoggedUser onClick={props.onClick}>
    <UserAvatar
      isArrow
      name={props.authContext.profile.name}
      avatarImg={'/static/assets/userdefault.png'}
      party={''} />
  </StyledLoggedUser>
)

export default WithUserContext(LoggedUser)
