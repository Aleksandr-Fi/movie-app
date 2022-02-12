import propTypes from 'prop-types'

import FilmCard from '../FilmCard/FilmCard'

const FilmsList = ({ filmsData }) => {
  FilmsList.propTypes = {
    filmsData: propTypes.array.isRequired,
  }
  return (
    <div>
      <ul className="films-list">
        {filmsData.map((film) => {
          return <FilmCard key={film.id} {...film} />
        })}
      </ul>
    </div>
  )
}

export default FilmsList
