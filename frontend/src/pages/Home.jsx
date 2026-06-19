import { getUser } from '../lib/auth'
import { todayISO, formatLongDate, greeting } from '../lib/date'
import TopNav from '../components/TopNav'
import WorkoutSummary from '../components/dashboard/WorkoutSummary'
import NutritionSummary from '../components/dashboard/NutritionSummary'
import './home.css'

function Home() {
  const user = getUser()
  const today = todayISO()

  return (
    <div className="home">
      <TopNav />
      <main className="home-main">
        <header className="home-header">
          <h1>{greeting()}, {user?.username}</h1>
          <p className="muted">{formatLongDate(today)}</p>
        </header>
        <div className="dashboard-grid">
          <WorkoutSummary date={today} />
          <NutritionSummary date={today} />
        </div>
      </main>
    </div>
  )
}

export default Home
