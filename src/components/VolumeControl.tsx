import React from "react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) / 100;
    onVolumeChange(value);
  };

  return (
    <div className="w-40 p-4">
      <label className="text-sm text-gray-300 mr-2 mt-5"></label>
      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100}
        onChange={handleVolumeChange}
        style={{
          accentColor: '#3b82f6',
          backgroundColor: '#333'
        }}
        className="w-full h-2 rounded-lg cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;

