import { Component } from 'react'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'

export default class App extends Component {
  movieService = new MovieService()
  maxId = 1

  state = {
    filmsData: this.getFilmsList(12),
    isFetched: false,
  }

  getFilmsList(quantity) {
    let arr = []
    for (let i = 0; i < quantity; i++) {
      arr.push(this.getFilm())
    }
    return arr
  }

  getFilm() {
    return {
      id: this.maxId++,
      poster: '..image/Rectangle.png',
      title: 'The way back',
      releaseDate: '2022-01-01',
      overview:
        'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high ...',
      genre: ['Action', 'Drama'],
    }
  }

  updateState() {
    if (!this.state.isFetched) {
      this.movieService.getPageMovie(1).then((res) => {
        this.setState({ filmsData: res, isFetched: true })
      })
    }
  }

  render() {
    this.updateState()
    const { filmsData } = this.state
    return <FilmsList filmsData={filmsData} />
  }
}
