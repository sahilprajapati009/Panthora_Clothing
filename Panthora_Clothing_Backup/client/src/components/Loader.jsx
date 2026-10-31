const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in" id="loader">
      <div className="relative w-10 h-10 mb-4">
        <div className="absolute inset-0 border-2 border-border rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
      </div>
      <p className="text-text-muted text-sm tracking-wider uppercase">{text}</p>
    </div>
  );
};

export default Loader;
