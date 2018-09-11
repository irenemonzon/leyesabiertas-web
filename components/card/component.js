import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CardHeader from '../../elements/card-header/component'
import CardContent from '../../elements/card-content/component'
import CardSocial from '../../elements/card-social/component'

const CardContainer = styled.div`
width: 370px;
height: 340px;
box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
background-color: #ffffff;
border: solid 1px #e9e9e9;
display:flex;
flex-direction:column;
justify-content:space-between;
background: #fff;
box-sizing: border-box;
cursor: pointer;

`

const Card = ({ project }) => (
  <Link href={{ pathname: '/proyecto', query: { id: project.id['$oid'] } }}>
    <CardContainer>
      { project.img &&
      <CardHeader img={project.img} />
      }
      <CardContent tagTitle={project.tagTitle}
        title={project.title}
        avatarImg={project.author.avatarImg}
        name={project.author.name}
        party={project.author.party} />
      <CardSocial commentaries={project.commentaries}
        limitDate={project.limitDate} />
    </CardContainer>
  </Link>
)

Card.propTypes = {
  project: PropTypes.shape({
    img: PropTypes.string,
    commentaries: PropTypes.number.isRequired,
    limitDate: PropTypes.string,
    title: PropTypes.string.isRequired,
    tagTitle: PropTypes.string.isRequired,
    author: PropTypes.shape({
      avatarImg: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      party: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default Card