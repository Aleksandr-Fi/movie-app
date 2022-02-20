import { Component } from 'react'
import { format } from 'date-fns'
import { Card, Rate, Progress } from 'antd'

import GenresList from '../GenresList'

export default class FilmCard extends Component {
  constructor(props) {
    super(props)
    this.onChangeRate = async (newRate) => {
      this.setState({ rate: newRate })
      await this.props.filmContext.movieService.setRateFilm(this.props.id, this.state.guestId, newRate)
      this.props.filmContext.ratedUpdete()
    }
  }

  componentDidMount() {
    this.updateRate()
  }

  componentDidUpdate(prevProps) {
    if (this.props.rating !== prevProps.rating) {
      this.setState({ rate: this.props.rating })
    }
  }

  state = {
    guestId: this.props.filmContext.appState.guestSessionId,
    poster: this.props.poster_path,
    title: this.props.original_title,
    releaseDate: this.props.release_date,
    genre: this.props.genre_ids,
    overview: this.props.overview,
    rate: this.props.rating,
    voteAverage: 0,
  }

  getShortText(str, title) {
    const strCount = window.innerWidth <= 1010 ? 325 : 180
    const strLength = window.innerWidth <= 1010 ? 65 : 32
    const titleStringLength = window.innerWidth <= 1010 ? 24 : 10
    const gebreArrayLength = window.innerWidth <= 1010 ? 3 : 3

    const spaceString =
      (Math.ceil(title.length / titleStringLength) + Math.ceil(this.state.genre.length / gebreArrayLength) - 2) *
      strLength
    const n = strCount - spaceString

    if (str.length > n) {
      const shortText = str.substr(0, n - 1)
      const arrayWords = shortText.split(' ')
      return `${arrayWords.slice(0, -1).join(' ')} ...`
    }
    return str
  }

  updateRate() {
    this.props.filmContext.movieService.getRateFilm(this.props.id).then((res) => {
      this.setState({ voteAverage: res })
    })
  }

  getRateColor(num) {
    if (num <= 3) {
      return '#E90000'
    }
    if (num <= 5) {
      return '#E97E00'
    }
    if (num <= 7) {
      return '#E9D100'
    }
    return '#66E900'
  }

  render() {
    const { poster, title, releaseDate, genre, overview, rate } = this.state

    return (
      <Card className="film-card" hoverable>
        <img className="film-poster" alt="title" src={`https://image.tmdb.org/t/p/w185${poster}`} />
        <div className="film-info">
          <Progress
            className="vote-circle"
            type="circle"
            trailColor={this.getRateColor(this.state.voteAverage)}
            format={() => `${this.state.voteAverage}`}
            width={30}
          />
          <h1 className="film-title">{title}</h1>
          <span className="film-date">{releaseDate ? format(new Date(releaseDate), 'PP') : null}</span>
          <GenresList genreIds={genre} />
          <p className="film-overview overview-tab">{this.getShortText(overview, title)}</p>
        </div>
        <p className="film-overview overview-mobile">{this.getShortText(overview, title)}</p>
        <Rate
          className="rate"
          count={10}
          value={rate}
          style={{ fontSize: 16, width: 239 }}
          onChange={this.onChangeRate}
        />
      </Card>
    )
  }
}
