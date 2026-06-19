function Card({ title, action, children }) {
  return (
    <section className="card">
      <header className="card-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  )
}

export default Card
