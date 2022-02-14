import { Component } from 'react'
import { Layout, Spin, Alert } from 'antd'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'

export default class App extends Component {
  movieService = new MovieService()
  maxId = 1

  state = {
    filmsData: null,
    isFetched: false,
    errorFilms: false,
  }

  onError = () => {
    this.setState({
      errorFilms: true,
    })
  }

  componentDidMount() {
    if (!this.state.isFetched) {
      this.movieService
        .getPageMovie(1)
        .then((res) => {
          this.setState({ filmsData: res, isFetched: true })
        })
        .catch(this.onError)
    }
  }

  render() {
    const { filmsData, errorFilms } = this.state
    const { Header, Footer, Content } = Layout
    const alert = errorFilms ? (
      <Alert message="Error" description="The movie was not found." type="error" showIcon />
    ) : null
    const spiner = !filmsData ? <Spin className="spiner" size="large" /> : null
    const filmList = filmsData ? <FilmsList filmsData={filmsData} /> : null

    return (
      <Layout>
        <Header>Header</Header>
        <Content>
          {alert}
          {spiner}
          {filmList}
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}
