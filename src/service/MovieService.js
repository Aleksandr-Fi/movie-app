export default class MovieService {
  _apiDese = 'https://api.themoviedb.org/3/search/movie?api_key=3dbe94ac65d25acc70a9f844a009c611'

  async getResource(query, page) {
    const res = await fetch(`${this._apiDese}&query=${query}&page=${page}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${query}, recived ${res.status}`)
    }
    return await res.json()
  }

  async getPageMovie(page) {
    const res = await this.getResource('return', page)
    return await res.results
  }
}
