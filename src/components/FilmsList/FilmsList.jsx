import propTypes from 'prop-types'

import FilmCard from '../FilmCard/FilmCard'
import { MovieConsumer } from '../../MovieContext'

const FilmsList = ({ filmsData }) => {
  FilmsList.propTypes = {
    filmsData: propTypes.array.isRequired,
  }

  return (
    <div>
      <ul className="films-list">
        <MovieConsumer>
          {(context) => {
            {
              return filmsData.map((film) => <FilmCard key={film.id} {...film} filmContext={context} />)
            }
          }}
        </MovieConsumer>
      </ul>
    </div>
  )
}

export default FilmsList
