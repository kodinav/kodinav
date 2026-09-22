/**
 * The fixed backdrop behind every page: a dark field with soft, slowly
 * turning colour behind a heavy blur, and a darkening veil over it. Pure CSS
 * (see .aurora in globals.css); nothing to download, nothing to run.
 */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden>
      <div className="aurora-ring">
        <i className="a1" />
        <i className="a2" />
        <i className="a3" />
        <i className="a4" />
      </div>
      <div className="aurora-veil" />
    </div>
  );
}
