import { Component } from 'react'
import { Layout, Spin, Alert, Pagination, Button, Empty } from 'antd'
import debounce from 'lodash.debounce'

import MovieService from '../../service/MovieService'
import FilmsList from '../FilmsList'
import SearchForm from '../SearchForm'
import { MovieProvider } from '../../context'

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

  componentDidMount() {
    this.movieService.getGenre().then((res) => {
      this.setState({ genre: res })
    })
    this.setGuestId()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.setState({ searchGuide: false })
    }
    if (
      this.state.query !== prevState.query ||
      this.state.page !== prevState.page ||
      this.state.tabSearch !== prevState.tabSearch
    ) {
      this.setState({ searchData: null, totalSearch: null, totalRated: null, errorFilms: false })
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

  state = {
    tabSearch: 'search',
    page: 1,
    query: '',
    totalSearch: null,
    totalRated: null,
    searchData: null,
    isFetched: false,
    errorFilms: false,
    searchGuide: true,
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

  getTotal(total) {
    return Math.ceil(total / 2)
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
    if (this.state.tabSearch && this.state.searchGuide) {
      return (
        <div>
          <Alert
            message="Search guide"
            description="To search for movies, start typing the name of the movie."
            type="info"
            showIcon
          />
          <Empty
            imageStyle={{
              margin: 10,
            }}
          />
        </div>
      )
    }
    if (this.state.tabSearch && (this.state.errorFilms || (this.state.searchData && !this.state.searchData.length))) {
      return <Alert message="Error" description="Error when searching for a movie" type="error" showIcon />
    }
    if (!this.state.tabSearch && this.state.ratedData && !this.state.ratedData.length) {
      return (
        <div>
          <Alert message="the rated movies were not found." type="info" />
          <Empty
            imageStyle={{
              margin: 10,
            }}
          />
        </div>
      )
    }
    return null
  }

  getTabsClass(generalTab) {
    if (!generalTab) {
      return {
        search: 'tabs-btn',
        rated: 'tabs-btn tab-active',
      }
    }
    return {
      search: 'tabs-btn tab-active',
      rated: 'tabs-btn',
    }
  }

  render() {
    const { page, tabSearch, totalSearch, totalRated, searchGuide } = this.state
    const { Header, Footer, Content } = Layout

    const filmList = this.getFilmList()
    const filmsAlert = this.getFilmAlert()

    const searchForm = tabSearch ? <SearchForm onChange={debounce(this.setNewQuery, 1000)} /> : null
    const spiner = !filmList && !searchGuide ? <Spin className="spiner" size="large" /> : null

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
                <Button className={this.getTabsClass(tabSearch).search} onClick={() => this.onChangeTabs(true)}>
                  Search
                </Button>
                <Button className={this.getTabsClass(tabSearch).rated} onClick={() => this.onChangeTabs(false)}>
                  Rated
                </Button>
              </nav>
              {searchForm}
            </Header>
            <Content className="main">
              {filmsAlert}
              {filmList}
              {spiner}
            </Content>
            <Footer className="footer">{pagination}</Footer>
          </div>
        </Layout>
      </MovieProvider>
    )
  }
}
