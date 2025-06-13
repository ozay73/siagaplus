export function Button({ children, variant = 'solid', className = '', ...props }) {
  const base = "rounded px-4 py-2 text-sm font-medium transition";
  const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-red-500 hover:bg-red-50"
  };
  return <button className={\`\${base} \${variants[variant] || ''} \${className}\`} {...props}>{children}</button>;
}
