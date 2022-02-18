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
    let n = 160
    if (title.length > 10 && title.length < 48) {
      n = 130
    }
    if (title.length > 48) {
      n = 100
    }
    const shortText = str.length > n ? str.substr(0, n - 1) + '&hellip;' : str
    const arrayWords = shortText.split(' ')
    return `${arrayWords.slice(0, -1).join(' ')} ...`
  }

  updateRate() {
    this.props.filmContext.movieService.getRateFilm(this.props.id).then((res) => {
      console.log(res)
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

  componentDidMount() {
    this.updateRate()
  }

  componentDidUpdate(prevProps) {
    if (this.props.rating !== prevProps.rating) {
      this.setState({ rate: this.props.rating })
    }
  }

  render() {
    const { poster, title, releaseDate, genre, overview, rate } = this.state
    return (
      <Card className="film-card" hoverable style={{ width: 454, height: 280 }}>
        <img className="film-poster" alt="poster" src={`https://image.tmdb.org/t/p/w185${poster}`} />
        <div className="film-content">
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
          <p className="film-overview">{this.getShortText(overview, title)}</p>
          <Rate
            className="rate"
            count={10}
            value={rate}
            style={{ fontSize: 16, width: 239 }}
            onChange={this.onChangeRate}
          />
        </div>
      </Card>
    )
  }
}
