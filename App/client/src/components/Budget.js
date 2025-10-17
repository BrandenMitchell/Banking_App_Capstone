import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

const Budget = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [advice, setAdvice] = useState('');
  const [diagramMermaid, setDiagramMermaid] = useState('');

  const diagramContainerRef = useRef(null);

  // Render Mermaid diagram when diagramMermaid updates
  useEffect(() => {
    let cancelled = false;
    async function renderDiagram() {
      if (!diagramMermaid || !diagramContainerRef.current) return;
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        const { svg } = await mermaid.render(`budget_${Date.now()}`, diagramMermaid);
        if (!cancelled && diagramContainerRef.current) {
          diagramContainerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) {
          diagramContainerRef.current.innerText = diagramMermaid;
        }
      }
    }
    renderDiagram();
    return () => { cancelled = true; };
  }, [diagramMermaid]);

  const canSubmit = useMemo(() => {
    const inc = Number(monthlyIncome);
    const sav = Number(savingsGoal);
    return Number.isFinite(inc) && inc > 0 && Number.isFinite(sav) && sav >= 0 && sav <= inc;
  }, [monthlyIncome, savingsGoal]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setAdvice('');
    setDiagramMermaid('');
    if (!canSubmit) {
      setError('Please enter a valid income (> 0) and a savings goal (>= 0 and <= income).');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        monthlyIncome: Number(monthlyIncome),
        savingsGoal: Number(savingsGoal),
        notes: notes || undefined
      };
      const { data } = await axios.post('/api/budget/plan', payload);
      setAdvice(data.advice || '');
      setDiagramMermaid(data.diagramMermaid || '');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-4">Budget Planner</h2>
      <form onSubmit={onSubmit} className="mb-4 w-100">
        <div className="mb-3 text-start">
          <label className="form-label">Monthly Income (USD)</label>
          <input
            type="number"
            className="form-control"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            min="0"
            step="1"
            placeholder="e.g. 5000"
            required
          />
        </div>
        <div className="mb-3 text-start">
          <label className="form-label">Monthly Savings Goal (USD)</label>
          <input
            type="number"
            className="form-control"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            min="0"
            step="1"
            placeholder="e.g. 1000"
            required
          />
        </div>
        <div className="mb-3 text-start">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="rent 1200, loan 200, prefer aggressive saving"
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={!canSubmit || loading}>
            {loading ? 'Generating…' : 'Create Budget'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => { setAdvice(''); setDiagramMermaid(''); setError(''); }} disabled={loading}>
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger text-start" role="alert">{error}</div>
      )}

      {advice && (
        <div className="card mb-3 text-start">
          <div className="card-header">Advice</div>
          <div className="card-body">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{advice}</pre>
          </div>
        </div>
      )}

      {diagramMermaid && (
        <div className="card text-start">
          <div className="card-header">Budget Diagram</div>
          <div className="card-body">
            <div ref={diagramContainerRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;


