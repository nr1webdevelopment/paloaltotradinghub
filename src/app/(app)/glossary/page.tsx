export const metadata = { title: 'Glossary · PATH' };

const TERMS: [string, string][] = [
  ['Alpha', 'Excess return of a strategy after subtracting market exposure.'],
  ['Backtest', 'Simulation of a trading strategy on historical data.'],
  ['Drawdown', 'Peak-to-trough loss over a period, often the worst observed.'],
  ['Edge', 'The structural reason a strategy generates excess returns — informational, behavioral, or technical.'],
  ['Feature', 'A number derived from data that you believe predicts future returns.'],
  ['Kelly Criterion', 'Optimal bet-sizing formula: edge over variance.'],
  ['Lookahead Bias', "Using information in a backtest that wouldn't actually be available at trade time."],
  ['Sharpe Ratio', 'Annualized return divided by annualized volatility — the standard risk-adjusted return metric.'],
  ['Slippage', 'The difference between the assumed and actual execution price.'],
  ['Survivorship Bias', 'Bias from datasets that only include companies still in existence today.'],
  ['VWAP', 'Volume-Weighted Average Price — an execution algorithm that trades in proportion to expected volume.'],
  ['Walk-Forward Analysis', 'Time-series cross-validation: train on a window, test on the next, slide forward.'],
];

export default function GlossaryPage() {
  return (
    <>
      <header className="mb-7">
        <div className="eyebrow">Reference</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">Glossary</h1>
        <p className="text-[15px] max-w-[680px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          The terms that appear throughout PATH, in one place.
        </p>
      </header>
      <div className="card p-5">
        {TERMS.map(([t, d]) => (
          <div key={t} className="border-b py-3.5 last:border-b-0" style={{ borderColor: 'var(--line-soft)' }}>
            <div className="font-mono text-[13px] font-bold mb-1" style={{ color: 'var(--accent)' }}>{t}</div>
            <div className="text-[14px]" style={{ color: 'var(--text-1)' }}>{d}</div>
          </div>
        ))}
      </div>
    </>
  );
}
