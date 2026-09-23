import { Ribbon } from "./Ribbon";

/**
 * The fixed backdrop behind every page: a dark field, the turning ribbon,
 * soft blooms of colour behind it, and a blurred, darkening veil over
 * everything (and a light veil when the page turns light).
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
      <Ribbon className="ribbon" />
      <div className="aurora-veil" />
    </div>
  );
}
