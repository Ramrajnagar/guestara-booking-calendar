import React from 'react';

export const HeatmapLegend = () => {
  return (
    <div className="heatmap-legend">
      <span className="legend-title">Occupancy:</span>
      <div className="legend-item">
        <div className="legend-color bg-white border"></div>
        <span>0%</span>
      </div>
      <div className="legend-item">
        <div className="legend-color occupancy-low"></div>
        <span>1-25%</span>
      </div>
      <div className="legend-item">
        <div className="legend-color occupancy-med"></div>
        <span>26-50%</span>
      </div>
      <div className="legend-item">
        <div className="legend-color occupancy-high"></div>
        <span>51-75%</span>
      </div>
      <div className="legend-item">
        <div className="legend-color occupancy-full"></div>
        <span>76-100%</span>
      </div>
    </div>
  );
};
