const nf = new Intl.NumberFormat('fr-FR')
export const fmt = (n) => nf.format(n || 0)

/**
 * Histogramme simple (barres groupées).
 * data: [{ key, label, values: [n1, n2] }], series: [{ name, className }]
 */
export function BarChart({ data, series, selected, onSelect, height = 220 }) {
  const max = Math.max(1, ...data.flatMap((d) => d.values))
  return (
    <div className="adm-chart">
      <div className="adm-chart-legend">
        {series.map((s) => (
          <span key={s.name}><i className={s.className} /> {s.name}</span>
        ))}
      </div>
      <div className="adm-chart-plot" style={{ height }}>
        {data.map((d) => {
          const Tag = onSelect ? 'button' : 'div'
          return (
            <Tag
              key={d.key}
              type={onSelect ? 'button' : undefined}
              className={`adm-chart-col ${selected === d.key ? 'is-selected' : ''}`}
              onClick={onSelect ? () => onSelect(d.key) : undefined}
              title={`${d.label} — ${series.map((s, i) => `${s.name} : ${fmt(d.values[i])}`).join(' · ')}`}
            >
              <span className="adm-chart-bars">
                {d.values.map((v, i) => (
                  <span key={i} className={`adm-chart-bar ${series[i].className}`} style={{ height: `${(v / max) * 100}%` }}>
                    {v > 0 && <em>{fmt(v)}</em>}
                  </span>
                ))}
              </span>
              <span className="adm-chart-label">{d.label}</span>
            </Tag>
          )
        })}
      </div>
    </div>
  )
}

/** Classement horizontal : [{ label, value }] */
export function RankList({ items, empty = 'Pas encore de données.' }) {
  const total = items.reduce((sum, i) => sum + i.value, 0)
  if (!total) return <p className="adm-muted">{empty}</p>
  const max = Math.max(...items.map((i) => i.value))
  return (
    <ul className="adm-rank">
      {items.map((item) => (
        <li key={item.label}>
          <div className="adm-rank-row">
            <span>{item.label}</span>
            <strong>{fmt(item.value)} <small>({Math.round((item.value / total) * 100)} %)</small></strong>
          </div>
          <div className="adm-rank-bar"><span style={{ width: `${(item.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  )
}
