export default function FractionDisplay({
  numerator,
  denominator,
  className,
}: {
  numerator: number;
  denominator: number;
  className?: string;
}) {
  return (
    <span className={className}>
      <sup>{numerator}</sup>
      <span>/</span>
      <sub>{denominator}</sub>
    </span>
  );
}
