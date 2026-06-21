import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getExercise } from '../api/exercises'
import TopNav from '../components/TopNav'
import './home.css'
import './workoutDetail.css'
import './exerciseDetail.css'

function ExerciseDetail() {
  const { id } = useParams()
  const [exercise, setExercise] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getExercise(id)
      .then((data) => { if (active) setExercise(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [id])

  const embedUrl = exercise?.videoId && `https://www.youtube.com/embed/${exercise.videoId}`
  const wger = exercise?.wger

  return (
    <div className="home">
      <TopNav />
      <main className="home-main">
        <Link to="/" className="back-link">← Back</Link>

        {error && <p className="card-error">{error}</p>}
        {!error && exercise === null && <p className="muted">Loading…</p>}

        {!error && exercise && (
          <>
            <header className="home-header">
              <h1>{exercise.name}</h1>
              {exercise.muscles && (
                <p className="muted">{exercise.muscles}</p>
              )}
            </header>

            {embedUrl && (
              <div className="exercise-video">
                <iframe
                  src={embedUrl}
                  title={`${exercise.name} demonstration`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {exercise.description && (
              <p className="exercise-description">{exercise.description}</p>
            )}

            {wger && (
              <dl className="exercise-meta">
                {wger.category && (
                  <div>
                    <dt>Category</dt>
                    <dd>{wger.category}</dd>
                  </div>
                )}
                {wger.equipment?.length > 0 && (
                  <div>
                    <dt>Equipment</dt>
                    <dd>{wger.equipment.join(', ')}</dd>
                  </div>
                )}
                {wger.musclesSecondary?.length > 0 && (
                  <div>
                    <dt>Secondary muscles</dt>
                    <dd>{wger.musclesSecondary.join(', ')}</dd>
                  </div>
                )}
              </dl>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default ExerciseDetail
