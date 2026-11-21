/** Two identical tracks allow a one-track translation to loop without a jump. */
export default function RunningText({ className, children }: { className: string; children: string }) {
  return <div className={className} data-marquee aria-hidden="true">
    <div className="marquee-track">{[0, 1].map(copy => <span className="marquee-group" key={copy}>{[0, 1, 2].map(index => <span key={index}>{children}</span>)}</span>)}</div>
  </div>;
}
