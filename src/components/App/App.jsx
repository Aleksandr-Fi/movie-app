import { Component } from 'react'
import { Layout, Spin, Alert, Pagination, Button } from 'antd'
import debounce from 'lodash.debounce'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'
import SearchForm from '../SearchForm'
import { MovieProvider } from '../MovieContext'

export default class App extends Component {
  movieService = new MovieService()

  constructor() {
    super()
    this.setNewQuery = (newQuery) => {
      this.setState({ query: newQuery })
    }
    this.onChangePage = (newPage) => {
      this.setState({ page: newPage })
    }
  }

  state = {
    page: 1,
    query: 'return',
    totalResults: null,
    filmsData: null,
    isFetched: false,
    errorFilms: false,
    genre: null,
    guestSessionId: null,
    ratedFilms: null,
  }

  onErrorFilms = () => {
    this.setState({
      errorFilms: true,
    })
  }

  setGuestId() {
    let id = localStorage.getItem('guestSessionId')
    if (!id) {
      this.movieService.getIdGuestSession().then((res) => {
        id = res
        localStorage.setItem('guestSessionId', res)
      })
    }
    this.setState({ guestSessionId: id })
  }

  ratedFilmsUpdete() {
    this.movieService.getRatedMovies(this.state.guestSessionId, 1).then((res) => {
      this.setState({ ratedFilms: res })
    })
  }

  filmsUpdete() {
    this.movieService
      .getPageMovie(this.state.query, this.state.page)
      .then((res) => {
        this.setState({ filmsData: res })
      })
      .catch(this.onErrorFilms)

    this.movieService
      .getTotalResults(this.state.query, this.state.page)
      .then((res) => {
        this.setState({ totalResults: res })
      })
      .catch(this.onErrorFilms)
  }

  ratedUpdete() {
    const retedArr = this.state.ratedFilms
    const filmsData = this.state.filmsData
    const newArr = filmsData.map((film) => {
      const idx = retedArr.findIndex((el) => el.id === film.id)
      if (idx >= 0) {
        return retedArr[idx]
      }
      return film
    })
    return newArr
  }

  getTotal() {
    return Math.ceil(this.state.totalResults / 2)
  }

  componentDidMount() {
    if (!this.state.isFetched) {
      this.filmsUpdete()
      this.setState({ isFetched: true })
    }
    this.movieService.getGenre().then((res) => {
      this.setState({ genre: res })
    })
    this.setGuestId()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query || this.state.page !== prevState.page) {
      this.setState({ filmsData: null, totalResults: null })
      this.filmsUpdete()
      this.ratedFilmsUpdete()
    }
    if (this.state.guestSessionId !== prevState.guestSessionId) {
      this.ratedFilmsUpdete()
    }
    if (this.state.filmsData && this.state.ratedFilms && this.state.ratedFilms !== prevState.ratedFilms) {
      this.setState({ filmsData: this.ratedUpdete() })
    }
  }

  render() {
    const { filmsData, errorFilms, page } = this.state
    const { Header, Footer, Content } = Layout
    const filmsAlert = errorFilms ? (
      <Alert message="Error" description="The movie was not found." type="error" showIcon />
    ) : null
    const spiner = !filmsData ? <Spin className="spiner" size="large" /> : null
    const filmList = filmsData ? <FilmsList filmsData={filmsData} /> : null
    const pagination = this.state.totalResults ? (
      <Pagination
        size="small"
        onChange={this.onChangePage}
        defaultCurrent={page}
        total={this.getTotal()}
        showSizeChanger={false}
      />
    ) : null

    return (
      <MovieProvider value={{ appState: this.state, movieService: this.movieService }}>
        <Layout className="body">
          <div className="wrapper">
            <Header className="header">
              <nav className="tabs">
                <Button className="tabs-btn">Search</Button>
                <Button className="tabs-btn">Rated</Button>
              </nav>
              <SearchForm onChange={debounce(this.setNewQuery, 1000)} />
            </Header>
            <Content className="main">
              {filmsAlert}
              {spiner}
              {filmList}
            </Content>
            <Footer className="footer">{pagination}</Footer>
          </div>
        </Layout>
      </MovieProvider>
    )
  }
}
