import { Component } from 'react'
import { Layout } from 'antd'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'

export default class App extends Component {
  movieService = new MovieService()
  maxId = 1

  state = {
    filmsData: this.getFilmsList(3),
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

  componentDidMount() {
    if (!this.state.isFetched) {
      this.movieService.getPageMovie(1).then((res) => {
        this.setState({ filmsData: res, isFetched: true })
      })
    }
  }

  render() {
    const { filmsData } = this.state
    const { Header, Footer, Content } = Layout
    return (
      <Layout>
        <Header>Header</Header>
        <Content>
          <FilmsList filmsData={filmsData} />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}
