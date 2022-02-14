import { Component } from 'react'
import { Layout, Spin } from 'antd'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'

export default class App extends Component {
  movieService = new MovieService()
  maxId = 1

  state = {
    filmsData: null,
    isFetched: false,
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
    const spiner = !filmsData ? <Spin className="spiner" size="large" /> : null
    const filmList = filmsData ? <FilmsList filmsData={filmsData} /> : null

    return (
      <Layout>
        <Header>Header</Header>
        <Content>
          {spiner}
          {filmList}
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}
