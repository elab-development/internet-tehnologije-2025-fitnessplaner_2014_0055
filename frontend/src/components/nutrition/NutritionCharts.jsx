import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MACRO_COLORS = ['#16a34a', '#86c8a0', '#cbd5e1']

function caloriesFor(entry) {
  return Math.round((entry.Food?.caloriesPer100g ?? 0) * (entry.grams / 100))
}

function NutritionCharts({ log, entries }) {
  const macroData = [
    { name: 'Protein', value: log?.protein ?? 0 },
    { name: 'Carbs', value: log?.carbs ?? 0 },
    { name: 'Fat', value: log?.fat ?? 0 },
  ]
  const hasMacros = macroData.some((m) => m.value > 0)

  const foodData = entries
    .map((entry) => ({ name: entry.Food?.name ?? 'Unknown', calories: caloriesFor(entry) }))
    .filter((d) => d.calories > 0)
    .sort((a, b) => b.calories - a.calories)

  if (!hasMacros && foodData.length === 0) return null

  return (
    <section>
      <h2 className="section-title">Overview</h2>
      <div className="charts">
        {hasMacros && (
          <div className="chart">
            <h3 className="chart-title">Macros (g)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={macroData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {macroData.map((entry, i) => (
                    <Cell key={entry.name} fill={MACRO_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} g`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="chart-legend">
              {macroData.map((m, i) => (
                <li key={m.name}>
                  <span className="legend-dot" style={{ background: MACRO_COLORS[i] }} />
                  {m.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {foodData.length > 0 && (
          <div className="chart">
            <h3 className="chart-title">Calories per food</h3>
            <ResponsiveContainer width="100%" height={Math.max(220, foodData.length * 36)}>
              <BarChart data={foodData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip formatter={(value) => [`${value} kcal`, 'Calories']} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="calories" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}

export default NutritionCharts
