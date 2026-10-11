import React, { useState } from 'react';
import { Product, PriceHistoryPoint } from '../../types';
import { getHistoryStats, formatCurrency } from '../../utils/pricing';
import { TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, Info } from 'lucide-react';

interface PriceHistoryChartProps {
  product: Product;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ product }) => {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const stats = getHistoryStats(product);
  const history: PriceHistoryPoint[] = product.priceHistory && product.priceHistory.length > 0
    ? product.priceHistory
    : [
        { date: '2026-06-01', price: product.mrp, retailer: 'Nykaa', eventNote: 'MRP' },
        { date: '2026-10-01', price: stats.allTimeLowest, retailer: 'Nykaa', eventNote: 'Current Sample' },
      ];

  // SVG Chart Geometry
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 30;
  const paddingBottom = 40;

  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices) * 0.95; // padding for chart
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice || 1;

  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1 || 1)) * (width - paddingX * 2);
    const y = height - paddingBottom - ((item.price - minPrice) / priceRange) * (height - paddingTop - paddingBottom);
    return { ...item, x, y };
  });

  // Construct SVG Path
  const linePath = points.reduce((path, pt, index) => {
    return index === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
  }, '');

  // Construct Area Path for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  const activePoint = activePointIndex !== null ? points[activePointIndex] : points[points.length - 1];

  return (
    <div className="bg-white rounded-xl border border-ivory-300 p-5 shadow-xs">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg font-bold text-espresso-900">Recorded Price History</h4>
            <span className="text-[10px] bg-blush-100 text-plum-900 font-semibold px-2 py-0.5 rounded-full border border-blush-300">
              Illustrative Sample
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-0.5">
            Demonstration tracking points across Indian online retailers
          </p>
        </div>

        {/* Selected Data Point Callout */}
        {activePoint && (
          <div className="bg-ivory-100 border border-ivory-300 px-3 py-1.5 rounded-lg text-right">
            <span className="text-[10px] text-espresso-500 uppercase tracking-wider block">
              {activePoint.date} · {activePoint.retailer}
            </span>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-base font-bold text-plum-900">{formatCurrency(activePoint.price)}</span>
              {activePoint.eventNote && (
                <span className="text-[10px] text-espresso-600 font-medium">({activePoint.eventNote})</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SVG Chart Rendering */}
      <div className="mt-4 relative overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`gradient-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#883556" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#883556" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="#EFECE4"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={(height - paddingBottom + paddingTop) / 2}
            x2={width - paddingX}
            y2={(height - paddingBottom + paddingTop) / 2}
            stroke="#EFECE4"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#DFD4CA"
          />

          {/* Shaded Area */}
          <path d={areaPath} fill={`url(#gradient-${product.id})`} />

          {/* Price Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6C2540"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Nodes */}
          {points.map((pt, idx) => {
            const isHovered = activePointIndex === idx;
            return (
              <g 
                key={idx} 
                className="cursor-pointer group"
                onMouseEnter={() => setActivePointIndex(idx)}
                onClick={() => setActivePointIndex(idx)}
              >
                {/* Invisible hover target */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                {/* Node outer ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#FAF8F5"
                  stroke="#6C2540"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Date Label on Bottom Axis */}
                <text
                  x={pt.x}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  className="text-[10px] fill-espresso-500 font-sans"
                >
                  {pt.date.split('-').slice(1).join('/')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-[11px] text-espresso-400 text-center italic mt-1">
        Hover or tap any node to inspect recorded sample date, retailer, and event notes.
      </p>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-ivory-200">
        <div className="bg-ivory-100 p-2.5 rounded-lg border border-ivory-200">
          <div className="flex items-center gap-1 text-[11px] text-espresso-500">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lowest Sample</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-emerald-800">
            {formatCurrency(stats.allTimeLowest)}
          </span>
        </div>

        <div className="bg-ivory-100 p-2.5 rounded-lg border border-ivory-200">
          <div className="flex items-center gap-1 text-[11px] text-espresso-500">
            <ArrowUpRight className="w-3.5 h-3.5 text-espresso-500" />
            <span>Highest Sample</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-espresso-800">
            {formatCurrency(stats.allTimeHighest)}
          </span>
        </div>

        <div className="bg-ivory-100 p-2.5 rounded-lg border border-ivory-200">
          <div className="flex items-center gap-1 text-[11px] text-espresso-500">
            <TrendingDown className="w-3.5 h-3.5 text-plum-700" />
            <span>Average Sample</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-espresso-900">
            {formatCurrency(stats.average)}
          </span>
        </div>

        <div className="bg-ivory-100 p-2.5 rounded-lg border border-ivory-200">
          <div className="flex items-center gap-1 text-[11px] text-espresso-500">
            <Calendar className="w-3.5 h-3.5 text-espresso-500" />
            <span>Last Sample Date</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-espresso-800 truncate block">
            {stats.latestDate}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-[11px] text-espresso-500 bg-ivory-50 p-2 rounded border border-ivory-200">
        <Info className="w-3.5 h-3.5 text-plum-600 shrink-0 mt-0.5" />
        <p>
          Historical observations reflect recorded archival snapshots and simulated festival drops. Historical prices are not guaranteed to reoccur.
        </p>
      </div>
    </div>
  );
};
