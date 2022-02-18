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
    this.ratedUpdete = () => {
      this.ratedDataUpdete()
    }
  }

  state = {
    tabSearch: 'search',
    page: 1,
    query: 'return',
    totalSearch: null,
    totalRated: null,
    searchData: null,
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
        this.setState({ searchData: res })
      })
      .catch(this.onErrorFilms)

    this.movieService
      .getTotalResults(this.state.query, this.state.page)
      .then((res) => {
        this.setState({ totalSearch: res })
      })
      .catch(this.onErrorFilms)
  }

  addRatedFilms() {
    const retedArr = this.state.ratedData
    const searchData = this.state.searchData
    const newArr = searchData.map((film) => {
      const idx = retedArr.findIndex((el) => el.id === film.id)
      if (idx >= 0) {
        return retedArr[idx]
      }
      return film
    })
    return newArr
  }

  getFilmList() {
    if (this.state.tabSearch && this.state.searchData) {
      return <FilmsList filmsData={this.state.searchData} />
    }
    if (!this.state.tabSearch && this.state.ratedData) {
      return <FilmsList filmsData={this.state.ratedData} />
    }
    return null
  }

  getFilmAlert() {
    if (this.state.tabSearch && this.state.errorFilms) {
      return <Alert message="Error" description="The movie was not found." type="error" showIcon />
    }
    if (!this.state.tabSearch && this.state.ratedData && !this.state.ratedData.length) {
      return <Alert message="the rated movies were not found." type="info" />
    }
    return null
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
    if (
      this.state.query !== prevState.query ||
      this.state.page !== prevState.page ||
      this.state.tabSearch !== prevState.tabSearch
    ) {
      this.setState({ searchData: null, totalSearch: null, totalRated: null })
      this.filmsUpdete()
      this.ratedDataUpdete()
    }
    if (this.state.guestSessionId !== prevState.guestSessionId) {
      this.ratedDataUpdete()
    }
    if (this.state.searchData && this.state.ratedData && this.state.ratedData !== prevState.ratedData) {
      this.setState({ searchData: this.addRatedFilms() })
    }
  }

  render() {
    const { page, tabSearch, totalSearch, totalRated } = this.state
    const { Header, Footer, Content } = Layout

    const filmList = this.getFilmList()
    const filmsAlert = this.getFilmAlert()

    const searchForm = tabSearch ? <SearchForm onChange={debounce(this.setNewQuery, 1000)} /> : null
    const spiner = !filmList ? <Spin className="spiner" size="large" /> : null

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
      <MovieProvider value={{ appState: this.state, movieService: this.movieService, ratedUpdete: this.ratedUpdete }}>
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
            </Content>
            <Footer className="footer">{pagination}</Footer>
          </div>
        </Layout>
      </MovieProvider>
    )
  }
}
