function BrandMark({ compact = false }) {
  return (
    <div className={compact ? 'brand brand-compact' : 'brand'}>
      <div className="brand-icon" aria-hidden="true">
        <span>✓</span>
      </div>
      <div>
        <strong>TaskFlow</strong>
        {!compact && <small>Minimalist task manager</small>}
      </div>
    </div>
  )
}

export default BrandMark
