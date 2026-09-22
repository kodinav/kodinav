/**
 * The fixed backdrop behind every page: a dark field, a wide ribbon of colour
 * turning slowly, four soft blooms behind it, and a blurred, darkening veil
 * over everything. Pure CSS (see .aurora in globals.css).
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
      <i className="aurora-band" />
      <div className="aurora-veil" />
    </div>
  );
}
