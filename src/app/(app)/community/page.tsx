export const metadata = { title: 'Community · PATH' };

export default function CommunityPage() {
  return (
    <>
      <header className="mb-7">
        <div className="eyebrow">Community</div>
        <h1 className="display text-[28px] md:text-[32px] leading-tight">You&apos;re not learning alone.</h1>
        <p className="text-[15px] max-w-[680px] mt-1.5" style={{ color: 'var(--text-2)' }}>
          Join other PATH students for code reviews, study groups, and live trading discussions.
        </p>
      </header>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {[
          ['Discord', '2,400 online', 'Daily threads on backtests, model picks, and live strategies. Channels for every module.', 'Join Discord →'],
          ['Office Hours', 'Weekly', 'Live Q&A every Thursday at 12:00 ET. Bring your code, leave with a debugged strategy.', 'Add to Calendar'],
          ['Study Groups', '12 groups', 'Small cohorts of 4–6 students working through the curriculum together. Match by time zone.', 'Get Matched'],
        ].map(([title, pill, desc, cta]) => (
          <div key={title} className="card p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="display text-[16px]">{title}</h3>
              <span className="pill">{pill}</span>
            </div>
            <p className="text-[14px] mb-4" style={{ color: 'var(--text-2)' }}>{desc}</p>
            <button className="btn">{cta}</button>
          </div>
        ))}
      </div>
    </>
  );
}
