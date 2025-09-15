const WindowControls: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors"
      />
      <div 
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors"
      />
      <div 
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors"
      />
    </div>
  );
};

export default WindowControls;


