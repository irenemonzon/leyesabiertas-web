import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Editor, findRange } from 'slate-react'
import { Value, KeyUtils, Range, Change, Mark } from 'slate'
import EditorTitle from '../../elements/editor-title/component'
import TitleMark from '../../elements/title-mark/component'
import CommentMark from '../../elements/comment-mark/component'
const API_URL = process.env.API_URL

const StyledEditorWrapper = styled.div`
  width: 100%;
  padding: 0 100px;
  margin-top: 48px;
  .editor {
    max-width: 700px;
    span {
      font-size: 1.8rem;
      line-height: 1.89;
      color: #203340;
    }
  }
`

export default class extends Component {
  state = {
    value: null,
    top: null,
    left: null,
    commentsIds: []
  }

  schema = {
    marks: {
      comment: {
        isAtomic: true
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.withComments !== this.props.withComments) {
      this.forceUpdate()
    }
  }

  componentDidMount () {
    if (this.props.value) {
      this.setState({
        value: Value.fromJSON(this.props.value)
      })
    }
  }

  onChange = ({ value }) => {
    this.setState({
      value
    })
  }

  onCommentHoverIn = (id) => (e) => {
    const top = e.clientY - 80
    const left = e.clientX - 100
    this.setState((prevState) => {
      return {
        commentsIds: prevState.commentsIds.concat(id),
        top: top,
        left: left
      }
    })
  }

  onCommentHoverOut = (id) => (e) => {
    this.setState({
      commentsIds: []
    })
  }

  fetchComments = (id) => async (e) => {
    e.preventDefault()
    try {
      const comments = await (await fetch(`${API_URL}/api/v1/documents/${this.props.id}/comments?ids=${this.state.commentsIds}`)).json()
      this.setState({
        comments: comments.results
      })
    } catch (err) {
      console.error(err)
    }
  }

  renderMark = (props) => {
    switch (props.mark.type) {
      case 'title':
        return <TitleMark {...props} />
      case 'comment':
        return <CommentMark
          id={props.mark.toJSON().data['data-id']}
          onMouseEnter={this.onCommentHoverIn}
          onMouseLeave={this.onCommentHoverOut}
          onClick={this.fetchComments}
          {...props} />
      default:
        return false
    }
  }

  render () {
    if (!this.state.value) return null
    return (
      <StyledEditorWrapper>
        <EditorTitle>Artículos de la propuesta</EditorTitle>
        <Editor
          className='editor'
          schema={this.schema}
          value={this.state.value}
          onChange={this.onChange}
          spellCheck={false}
          renderMark={this.renderMark}
          readOnly />
      </StyledEditorWrapper>
    )
  }
}