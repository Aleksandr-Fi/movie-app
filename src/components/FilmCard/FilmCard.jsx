import { Component } from 'react'
import { format } from 'date-fns'
import { Card } from 'antd'

export default class FilmCard extends Component {
  state = {
    poster: this.props.poster_path,
    title: this.props.original_title,
    releaseDate: this.props.release_date,
    genre: this.props.genre_ids,
    overview: this.props.overview,
  }

  getShortText(str, n) {
    const shortText = str.length > n ? str.substr(0, n - 1) + '&hellip;' : str
    const arrayWords = shortText.split(' ')
    return `${arrayWords.slice(0, -1).join(' ')} ...`
  }

  render() {
    const date = this.state.releaseDate
    return (
      <Card className="film-card" hoverable style={{ width: 454, height: 280 }}>
        <img className="film-poster" alt="poster" src={`https://image.tmdb.org/t/p/w185${this.state.poster}`} />
        <div className="film-content">
          <h1 className="film-title">{this.state.title}</h1>
          <span className="film-date">{date ? format(new Date(date), 'PP') : null}</span>
          <div className="film-genre">genre</div>
          <p className="film-overview">{this.getShortText(this.state.overview, 160)}</p>
        </div>
      </Card>
    )
  }
}
