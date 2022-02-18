export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'
  _apiKey = 'api_key=3dbe94ac65d25acc70a9f844a009c611'
  async getResource(query, page) {
    const res = await fetch(`${this._apiBase}/search/movie?${this._apiKey}&query=${query}&page=${page}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${query}, recived ${res.status}`)
    }
    return await res.json()
  }

  async getPageMovie(query, page) {
    const res = await this.getResource(query, page)
    return await res.results
  }

  async getTotalResults(query, page) {
    const res = await this.getResource(query, page)
    return await res.total_results
  }

  async getGenre() {
    const res = await fetch(`${this._apiBase}/genre/movie/list?${this._apiKey}`)
    if (!res.ok) {
      throw new Error(`Could not fetch genre, recived ${res.status}`)
    }
    const bodyRes = await res.json()
    return await bodyRes.genres
  }

  async getIdGuestSession() {
    const res = await fetch(`${this._apiBase}/authentication/guest_session/new?${this._apiKey}`)
    if (!res.ok) {
      throw new Error(`failed to create a new guest session, recived ${res.status}`)
    }
    const bodyRes = await res.json()
    return await bodyRes.guest_session_id
  }

  async setRateFilm(idFilm, guestId, rate) {
    const res = await fetch(`${this._apiBase}/movie/${idFilm}/rating?${this._apiKey}&guest_session_id=${guestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rate,
      }),
    })
    if (!res.ok) {
      throw new Error(`failed to send movie rating, recived ${res.status}`)
    }
    return await res.json()
  }

  async getRateFilm(idFilm) {
    const res = await fetch(`${this._apiBase}/movie/${idFilm}?${this._apiKey}`)
    if (!res.ok) {
      throw new Error(`failed to get the movie rated, recived ${res.status}`)
    }
    const bodyRes = await res.json()
    return await bodyRes.vote_average
  }

  async getRatedMovies(id, page) {
    const res = await fetch(`${this._apiBase}/guest_session/${id}/rated/movies?${this._apiKey}&page=${page}`)
    if (!res.ok) {
      throw new Error(`failed to get the rated movies for a guest session, recived ${res.status}`)
    }
    const bodyRes = await res.json()
    return await bodyRes.results
  }

  async getRatedTotal(id, page) {
    const res = await fetch(`${this._apiBase}/guest_session/${id}/rated/movies?${this._apiKey}&page=${page}`)
    const bodyRes = await res.json()
    return await bodyRes.total_results
  }
}
