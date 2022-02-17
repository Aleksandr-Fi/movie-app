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
    this.onChangeTabs = (newProp) => {
      this.setState({ tabSearch: newProp, page: 1 })
    }
  }

  state = {
    tabSearch: 'search',
    page: 1,
    query: 'return',
    totalSearch: null,
    totalRated: null,
    filmsData: null,
    isFetched: false,
    errorFilms: false,
    genre: null,
    guestSessionId: null,
    ratedData: null,
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

  ratedDataUpdete() {
    this.movieService.getRatedMovies(this.state.guestSessionId, this.state.page).then((res) => {
      this.setState({ ratedData: res })
    })
    this.movieService.getRatedTotal(this.state.guestSessionId, this.state.page).then((res) => {
      this.setState({ totalRated: res })
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
        this.setState({ totalSearch: res })
      })
      .catch(this.onErrorFilms)
  }

  ratedUpdete() {
    const retedArr = this.state.ratedData
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

  getTotal(total) {
    return Math.ceil(total / 2)
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
      this.setState({ filmsData: null, totalSearch: null, totalRated: null })
      this.filmsUpdete()
      this.ratedDataUpdete()
    }
    if (this.state.guestSessionId !== prevState.guestSessionId) {
      this.ratedDataUpdete()
    }
    if (this.state.filmsData && this.state.ratedData && this.state.ratedData !== prevState.ratedData) {
      this.setState({ filmsData: this.ratedUpdete() })
    }
  }

  render() {
    const { filmsData, errorFilms, page, tabSearch, ratedData, totalSearch, totalRated } = this.state
    const { Header, Footer, Content } = Layout
    const filmsAlert = errorFilms ? (
      <Alert message="Error" description="The movie was not found." type="error" showIcon />
    ) : null
    const searchForm = tabSearch ? <SearchForm onChange={debounce(this.setNewQuery, 1000)} /> : null
    const spiner = !filmsData ? <Spin className="spiner" size="large" /> : null
    const filmList = filmsData && tabSearch ? <FilmsList filmsData={filmsData} /> : null
    const ratedFilms = ratedData && !tabSearch ? <FilmsList filmsData={ratedData} /> : null
    const totalResults = tabSearch ? totalSearch : totalRated
    const pagination = totalResults ? (
      <Pagination
        size="small"
        onChange={this.onChangePage}
        defaultCurrent={page}
        total={this.getTotal(totalResults)}
        showSizeChanger={false}
      />
    ) : null

    return (
      <MovieProvider value={{ appState: this.state, movieService: this.movieService }}>
        <Layout className="body">
          <div className="wrapper">
            <Header className="header">
              <nav className="tabs">
                <Button className="tabs-btn" onClick={() => this.onChangeTabs(true)}>
                  Search
                </Button>
                <Button className="tabs-btn" onClick={() => this.onChangeTabs(false)}>
                  Rated
                </Button>
              </nav>
              {searchForm}
            </Header>
            <Content className="main">
              {filmsAlert}
              {spiner}
              {filmList}
              {ratedFilms}
            </Content>
            <Footer className="footer">{pagination}</Footer>
          </div>
        </Layout>
      </MovieProvider>
    )
  }
}
