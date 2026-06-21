function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="text-5xl mb-4 opacity-40">{icon}</div>
      )}
      <h3 className="font-display text-2xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-gundam-muted max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

export default EmptyState;
