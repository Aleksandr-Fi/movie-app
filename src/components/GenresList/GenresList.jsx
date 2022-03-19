import { MovieConsumer } from '../../context'

const GenresList = ({ genreIds }) => {
  return (
    <MovieConsumer>
      {({ appState }) => {
        const genreData = appState.genre
        if (!genreData || !genreIds) {
          return
        }
        return (
          <ul className="geners-list">
            {genreIds.map((id) => {
              const idx = genreData.findIndex((el) => el.id === id)
              const name = genreData[idx].name
              return (
                <button className="btn-genre" key={id}>
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
