import type { Course } from './types';

/**
 * The full course content lives here as a static data structure.
 * Lesson `content` is HTML; pages render it via dangerouslySetInnerHTML.
 *
 * If you ever want lessons to be editable from a CMS, move this into
 * Supabase tables (`modules`, `lessons`) and fetch them server-side.
 */
export const COURSE: Course = {
  title: 'PATH: Palo Alto Trading Hub',
  modules: [
    {
      id: 'm1',
      title: 'Foundations of AI Trading',
      summary:
        'Build a mental model for how AI is reshaping markets — what alpha is, where edge comes from, and how the modern quant stack fits together.',
      duration: '1h 20m',
      lessons: [
        {
          id: 'm1-l1',
          title: 'What is AI Trading?',
          duration: 12,
          content: `
            <p>AI trading is the use of statistical and machine-learning models to make systematic decisions about <em>what</em> to trade, <em>when</em>, and <em>how much</em>. It sits at the intersection of three disciplines: quantitative finance, machine learning, and software engineering.</p>
            <p>Unlike discretionary trading — where a human reads news, charts, and gut feelings — AI trading turns decisions into reproducible code. Every trade can be traced back to a specific input feature and model output, which makes the whole process measurable.</p>
            <h2>What you'll learn in this course</h2>
            <ul>
              <li>How to source, clean, and engineer features from market data</li>
              <li>Which ML models work for time-series and which fail silently</li>
              <li>How to backtest strategies without fooling yourself</li>
              <li>How to size positions and manage risk like a fund</li>
              <li>How to deploy a strategy to live capital safely</li>
            </ul>
            <div class="callout"><strong>A note on expectations.</strong> AI trading isn't a money-printing machine. The skill you're building is the discipline to find tiny statistical edges and protect them with risk management.</div>
          `,
        },
        {
          id: 'm1-l2',
          title: 'The Modern Quant Stack',
          duration: 14,
          content: `
            <p>A working AI trading system has five layers, each with its own tooling. Confusing these layers is the most common mistake beginners make.</p>
            <h2>The five layers</h2>
            <ul>
              <li><strong>Data layer</strong> — vendors like Polygon, Alpaca, or your own scrapers. Storage in Parquet or DuckDB.</li>
              <li><strong>Research layer</strong> — Jupyter notebooks, pandas, scikit-learn, PyTorch.</li>
              <li><strong>Backtest layer</strong> — vectorbt, Backtrader, or a custom engine.</li>
              <li><strong>Execution layer</strong> — broker APIs (Alpaca, Interactive Brokers), order routing.</li>
              <li><strong>Monitoring layer</strong> — dashboards, alerts, kill switches.</li>
            </ul>
            <p>You can build your first strategies using only the first three layers — but a strategy that touches real capital must have all five.</p>
          `,
        },
        {
          id: 'm1-l3',
          title: 'Alpha, Signals, and Edge',
          duration: 11,
          content: `
            <p>Three words you'll hear constantly: alpha, signal, and edge.</p>
            <p><strong>A signal</strong> is any number derived from data that you believe carries information about future returns.</p>
            <p><strong>Alpha</strong> is the excess return of a strategy after subtracting market exposure.</p>
            <p><strong>Edge</strong> is the structural reason your alpha exists — informational, behavioral, or technical.</p>
            <div class="callout"><strong>Rule of thumb.</strong> If you can't articulate your edge in one sentence, your strategy probably doesn't have one.</div>
          `,
        },
        {
          id: 'm1-l4',
          title: 'Setting Up Your Research Environment',
          duration: 16,
          content: `
            <p>You need three things: a Python environment, market data, and a backtesting library.</p>
            <pre><code>conda create -n path-trading python=3.11
conda activate path-trading
pip install pandas numpy scikit-learn matplotlib
pip install yfinance vectorbt jupyterlab</code></pre>
            <p>For market data, <code>yfinance</code> is free and fine for daily-bar research. Once you graduate to intraday, you'll want a paid feed like Polygon or Alpaca.</p>
          `,
        },
        {
          id: 'm1-l5',
          title: 'Reading the Market: A Mental Model',
          duration: 13,
          content: `
            <p>Before you write a single line of model code, internalize this: markets are not stationary. The same input that predicted returns in 2018 may predict the opposite in 2024.</p>
            <h2>The four regimes you'll encounter</h2>
            <ul>
              <li><strong>Trending</strong> — momentum signals work, mean-reversion fails</li>
              <li><strong>Mean-reverting</strong> — the inverse</li>
              <li><strong>High volatility</strong> — risk management matters more than signal quality</li>
              <li><strong>Crisis</strong> — correlations go to 1, models built on calm data break</li>
            </ul>
          `,
        },
      ],
      quiz: {
        questions: [
          {
            q: 'Which of these best describes "edge" in a trading context?',
            options: [
              'Any backtested strategy with a positive Sharpe ratio',
              'The structural reason a strategy generates excess returns',
              'A signal with low correlation to the market',
              'A model trained on the most recent 12 months of data',
            ],
            correct: 1,
            why: 'Edge is the structural source of your alpha — informational, behavioral, or technical. Without it, returns are luck.',
          },
          {
            q: 'Why is non-stationarity a uniquely hard problem in trading ML?',
            options: [
              'Trading datasets are always small',
              'Most algorithms require GPUs to train',
              'The relationship between features and returns drifts over time',
              'Brokers limit how often you can retrain models',
            ],
            correct: 2,
            why: 'In images, a cat is always a cat. In markets, the predictive relationship between a feature and future returns can weaken, vanish, or reverse.',
          },
          {
            q: 'Which layer of the quant stack is responsible for kill switches and alerts?',
            options: ['Data', 'Research', 'Backtest', 'Monitoring'],
            correct: 3,
            why: 'Monitoring is the safety net for live systems — without it, you only learn a strategy is broken after it has already lost money.',
          },
        ],
      },
    },
    {
      id: 'm2',
      title: 'Market Data & Feature Engineering',
      summary:
        'Most of the work in AI trading is data work. Learn where to get it, how to clean it, and how to turn it into features a model can actually learn from.',
      duration: '1h 30m',
      lessons: [
        {
          id: 'm2-l1',
          title: 'Sources of Market Data',
          duration: 14,
          content: `<p>OHLCV data is enough for 80% of beginner research. Fundamentals (quarterly), and alternative data (satellite, sentiment) add tier 2 and tier 3 signal.</p>`,
        },
        {
          id: 'm2-l2',
          title: 'Cleaning Time Series Data',
          duration: 18,
          content: `<p>Real market data has gaps, bad ticks, and corporate-action distortions. Build a deterministic cleaning pipeline before modeling.</p>`,
        },
        {
          id: 'm2-l3',
          title: 'Engineering Predictive Features',
          duration: 20,
          content: `<p>The art of feature engineering is the art of trading. Momentum, mean-reversion, volatility, and cross-sectional rank are the core categories.</p>`,
        },
        {
          id: 'm2-l4',
          title: 'Avoiding Survivorship and Lookahead Bias',
          duration: 17,
          content: `<p>These two biases quietly destroy beginner research. Survivorship bias only includes companies that exist today; lookahead bias uses information not yet available at trade time.</p>`,
        },
      ],
      quiz: {
        questions: [
          {
            q: 'Which type of bias arises when your dataset only includes companies that still exist today?',
            options: ['Lookahead bias', 'Survivorship bias', 'Selection bias', 'Confirmation bias'],
            correct: 1,
            why: 'Survivorship bias systematically removes failures from history, making backtests look better than reality.',
          },
          {
            q: 'Why is "shifting" a signal by one period often necessary in backtests?',
            options: [
              'To improve the Sharpe ratio',
              "To prevent the backtest from using information not yet available at trade time",
              'To smooth out noisy features',
              'To reduce computational load',
            ],
            correct: 1,
            why: "Without the shift, today's trade is being decided using today's close — information you would not actually have at the open.",
          },
        ],
      },
    },
    {
      id: 'm3',
      title: 'Machine Learning for Trading',
      summary:
        'Pick the right model for the right problem. Tree ensembles, neural networks, and reinforcement learning — and when each one quietly fails.',
      duration: '2h 5m',
      lessons: [
        { id: 'm3-l1', title: 'Supervised Learning Refresher', duration: 14, content: `<p>Regression predicts returns directly; classification predicts whether returns will be in the top quintile. Classification often works better.</p>` },
        { id: 'm3-l2', title: 'Tree Models: Random Forest & XGBoost', duration: 18, content: `<p>For tabular financial data, gradient-boosted trees usually beat everything else.</p>` },
        { id: 'm3-l3', title: 'Neural Networks for Time Series', duration: 22, content: `<p>Reach for NNs when sequence structure or unstructured data (news, order books) matters.</p>` },
        { id: 'm3-l4', title: 'Reinforcement Learning Basics', duration: 16, content: `<p>RL is appealing — learn signal and execution jointly — but the signal-to-noise ratio in markets makes it brutal in practice.</p>` },
        { id: 'm3-l5', title: 'Choosing the Right Model', duration: 11, content: `<p>Start with logistic regression. Move to XGBoost. Only reach for NNs or RL with a specific reason.</p>` },
      ],
      quiz: {
        questions: [
          {
            q: 'Why should you set shuffle=False when splitting time-series data?',
            options: ['To improve training speed', 'To prevent the model from learning future information', 'To balance class distributions', 'To reduce memory usage'],
            correct: 1,
            why: "Shuffling mixes future and past samples across train and test, leaking information that wouldn't be available in production.",
          },
          {
            q: 'Which model family is usually a stronger first choice for tabular trading data?',
            options: ['Deep neural networks', 'Gradient-boosted trees', 'Reinforcement learning', 'Convolutional networks'],
            correct: 1,
            why: 'GBMs handle tabular, non-linear, partially-noisy data extremely well and need far less data than neural networks.',
          },
        ],
      },
    },
    {
      id: 'm4',
      title: 'Backtesting & Evaluation',
      summary:
        'A backtest that lies to you is worse than no backtest. Build a faithful evaluation framework, learn the metrics that matter, and recognize the traps.',
      duration: '1h 25m',
      lessons: [
        { id: 'm4-l1', title: 'Building Your First Backtester', duration: 18, content: `<p>Vectorized backtests are fast for research. Event-driven backtests handle position-dependent logic.</p>` },
        { id: 'm4-l2', title: 'Sharpe, Sortino, and Drawdown', duration: 15, content: `<p>Sharpe above 2 is excellent; above 3 usually means a bug. Always inspect max drawdown.</p>` },
        { id: 'm4-l3', title: 'The Overfitting Trap', duration: 17, content: `<p>Test many strategies and the best one looks great by chance. Defend with held-out test sets and deflated metrics.</p>` },
        { id: 'm4-l4', title: 'Walk-Forward Validation', duration: 15, content: `<p>Train on a window, test on the next, slide forward. The honest performance estimator for time series.</p>` },
      ],
      quiz: {
        questions: [
          {
            q: 'A strategy reports a Sharpe of 4.5 on backtest data. What is the most likely explanation?',
            options: ['It is a genuinely world-class strategy', 'There is likely a bug, lookahead bias, or unrealistic cost assumption', 'The model is well-tuned', 'The dataset is too large'],
            correct: 1,
            why: 'Sharpe ratios above 3 in equity research are extremely rare. Almost all such results trace back to bias or unrealistic assumptions.',
          },
        ],
      },
    },
    {
      id: 'm5',
      title: 'Risk Management',
      summary:
        'A great signal with bad risk management blows up. Position sizing, portfolio construction, drawdown control, and how funds actually think about risk.',
      duration: '1h 10m',
      lessons: [
        { id: 'm5-l1', title: 'Position Sizing & The Kelly Criterion', duration: 16, content: `<p>Kelly is mathematically optimal for log growth but brutally volatile. Most traders use a fraction of Kelly (25–50%).</p>` },
        { id: 'm5-l2', title: 'Portfolio Construction', duration: 18, content: `<p>Diversification is the only free lunch. Cap single positions, limit gross exposure, watch factor exposures.</p>` },
        { id: 'm5-l3', title: 'Tail Risk and Black Swans', duration: 14, content: `<p>You can't predict black swans, but you can survive them. Hold cash, use options, design for fat tails.</p>` },
        { id: 'm5-l4', title: 'Stop-Losses and Drawdown Control', duration: 12, content: `<p>Stops help trend-following, hurt mean-reversion. Portfolio-level drawdown control beats per-trade stops.</p>` },
      ],
      quiz: {
        questions: [
          {
            q: 'Why do most traders use a fraction of Kelly rather than full Kelly?',
            options: [
              'Full Kelly is mathematically suboptimal',
              'Brokers do not allow full Kelly sizing',
              'Full Kelly produces volatility most investors cannot tolerate',
              'Full Kelly only works in casinos, not markets',
            ],
            correct: 2,
            why: 'Full Kelly is theoretically optimal but produces drawdowns and volatility most real investors abandon.',
          },
        ],
      },
    },
    {
      id: 'm6',
      title: 'Execution & Microstructure',
      summary:
        'A great signal poorly executed is a mediocre strategy. Order types, slippage, market impact, and how to bridge the gap between research and reality.',
      duration: '1h 5m',
      lessons: [
        { id: 'm6-l1', title: 'Order Types and Order Books', duration: 14, content: `<p>Market orders prioritize execution, limit orders prioritize price. Read the book.</p>` },
        { id: 'm6-l2', title: 'Slippage and Market Impact', duration: 16, content: `<p>Square-root rule: impact grows with √(order_size / ADV).</p>` },
        { id: 'm6-l3', title: 'TWAP and VWAP Execution', duration: 13, content: `<p>VWAP front- and back-loads execution to match volume; TWAP is uniform.</p>` },
        { id: 'm6-l4', title: 'Latency and Infrastructure', duration: 12, content: `<p>For daily-bar strategies, latency is irrelevant. Optimize for correctness first.</p>` },
      ],
      quiz: {
        questions: [
          {
            q: 'A market order guarantees:',
            options: ['A specific price', 'Execution, but not at any specific price', 'Both execution and a specific price', 'Neither execution nor a specific price'],
            correct: 1,
            why: 'Market orders cross the book and execute immediately, but the price you pay depends on available depth and may slip.',
          },
        ],
      },
    },
    {
      id: 'm7',
      title: 'Deploying Live Strategies',
      summary:
        'From notebook to production. Brokers, paper trading, monitoring, and the operational discipline that keeps a live strategy alive.',
      duration: '1h 30m',
      lessons: [
        { id: 'm7-l1', title: 'Brokers, APIs, and Paper Trading', duration: 16, content: `<p>Alpaca is beginner-friendly; IB is professional. Always paper-trade first.</p>` },
        { id: 'm7-l2', title: 'From Notebook to Production', duration: 22, content: `<p>Refactor into modules, add tests, use config files, make runs idempotent.</p>` },
        { id: 'm7-l3', title: 'Monitoring and Alerts', duration: 14, content: `<p>Quiet failures are more dangerous than loud ones. Heartbeat + data freshness + position drift.</p>` },
        { id: 'm7-l4', title: 'Capstone: Your First Live Strategy', duration: 38, content: `<p>A momentum + vol-target ETF rotation. Eight-week plan from research to live.</p>` },
      ],
      quiz: {
        questions: [
          {
            q: 'Why is paper trading a critical step before going live?',
            options: [
              'It is required by regulators',
              'It validates that production code matches backtest behavior under real market conditions',
              'It generates training data for the model',
              'It removes the need for a kill switch',
            ],
            correct: 1,
            why: 'Paper trading uncovers gaps between backtest assumptions and live behavior — slippage, fills, data latency — without risking capital.',
          },
        ],
      },
    },
  ],
};
