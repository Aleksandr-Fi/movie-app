import propTypes from 'prop-types'

import FilmCard from './FilmCard'

const FilmsList = ({ filmsData }) => {
  FilmsList.propTypes = {
    filmsData: propTypes.array.isRequired,
  }
  const films = filmsData.map((film) => {
    return <FilmCard key={film.id} {...film} />
  })
  return (
    <div>
      <ul>{films}</ul>
    </div>
  )
}

export default FilmsList
