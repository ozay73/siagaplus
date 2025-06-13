export function Card({ children, ...props }) {
  return <div className="bg-white rounded-lg shadow" {...props}>{children}</div>;
}
export function CardContent({ children, ...props }) {
  return <div className="p-4" {...props}>{children}</div>;
}
