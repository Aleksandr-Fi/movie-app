import { MovieConsumer } from '../../MovieContext'

const GenresList = ({ genreIds }) => {
  return (
    <MovieConsumer>
      {({ appState }) => {
        const genreData = appState.genre
        if (!genreData || !genreIds) {
          return
        }
        return (
          <ul className="ganers-list">
            {genreIds.map((id) => {
              const idx = genreData.findIndex((el) => el.id === id)
              const name = genreData[idx].name
              return (
                <button className="btn-ganre" key={id}>
                  {name}
                </button>
              )
            })}
          </ul>
        )
      }}
    </MovieConsumer>
  )
}

export default GenresList
