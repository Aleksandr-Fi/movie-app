import { Component } from 'react'
import { Input } from 'antd'
import propTypes from 'prop-types'

export default class SearchForm extends Component {
  state = {
    text: '',
  }
  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    })
    this.props.onChange(e.target.value)
  }
  onSubmit = (e) => {
    e.preventDefault()
    if (this.state.text.trim()) {
      this.props.onChange(this.state.text)
    }
    this.setState({
      text: '',
    })
  }

  static propTypes = {
    onChange: propTypes.func.isRequired,
  }

  render() {
    return (
      <form className="search-form" onSubmit={this.onSubmit}>
        <label className="input-label">
          <Input
            className="search"
            placeholder="Type to search..."
            autoFocus
            onChange={this.onChangeText}
            value={this.state.text}
          />
        </label>
      </form>
    )
  }
}
