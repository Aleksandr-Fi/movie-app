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
}
