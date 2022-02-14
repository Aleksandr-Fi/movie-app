import { Component } from 'react'
import { Layout, Spin, Alert } from 'antd'
import debounce from 'lodash.debounce'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'
import SearchForm from '../SearchForm'

export default class App extends Component {
  movieService = new MovieService()

  constructor() {
    super()
    this.setNewQuery = (newQuery) => {
      this.setState({ query: newQuery })
    }
  }

  state = {
    query: 'return',
    filmsData: null,
    isFetched: false,
    errorFilms: false,
  }

  onError = () => {
    this.setState({
      errorFilms: true,
    })
  }

  filmsUpdete() {
    this.movieService
      .getPageMovie(this.state.query, 1)
      .then((res) => {
        this.setState({ filmsData: res })
      })
      .catch(this.onError)
  }

  componentDidMount() {
    if (!this.state.isFetched) {
      this.filmsUpdete()
      this.setState({ isFetched: true })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.filmsUpdete()
    }
  }

  render() {
    const { filmsData, errorFilms } = this.state
    const { Header, Footer, Content } = Layout
    const filmsAlert = errorFilms ? (
      <Alert message="Error" description="The movie was not found." type="error" showIcon />
    ) : null
    const spiner = !filmsData ? <Spin className="spiner" size="large" /> : null
    const filmList = filmsData ? <FilmsList filmsData={filmsData} /> : null

    return (
      <Layout className="body">
        <div className="wrapper">
          <Header className="header">
            <SearchForm onChange={debounce(this.setNewQuery, 1000)} />
          </Header>
          <Content>
            {filmsAlert}
            {spiner}
            {filmList}
          </Content>
          <Footer>Footer</Footer>
        </div>
      </Layout>
    )
  }
}
