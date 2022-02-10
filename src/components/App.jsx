import { Component } from 'react'

import MovieService from '../service/MovieService'

export default class App extends Component {
  movieService = new MovieService()

  state = {
    title: null,
  }

  updateState() {
    this.movieService
      .getPageMovie(1)
      .then((res) => {
        return res[0]
      })
      .then((film) => {
        this.setState({ title: film.original_title })
      })
  }

  render() {
    this.updateState()
    return (
      <div>
        <h1>Hello React!</h1>
        <span>{this.state.title}</span>
      </div>
    )
  }
}
