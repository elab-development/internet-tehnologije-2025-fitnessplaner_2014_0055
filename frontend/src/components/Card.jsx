function Card({ title, action, accent = 'green', children }) {
  return (
    <section className={`card accent-${accent}`}>
      <header className="card-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  )
}

export default Card
