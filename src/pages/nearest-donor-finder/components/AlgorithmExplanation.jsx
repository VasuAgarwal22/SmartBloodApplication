import React from 'react';
import Icon from '../../../components/AppIcon';

const AlgorithmExplanation = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-md">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="Network" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-2">Algorithm Methodology</h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Our system uses <span className="font-semibold text-foreground">Graph Theory</span> combined with <span className="font-semibold text-foreground">Dijkstra's Algorithm</span> to calculate the shortest path between your location and available donors/blood banks.
          </p>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs md:text-sm font-semibold text-primary">1</span>
          </div>
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-1">Graph Construction</h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              All donor and blood bank locations are mapped as nodes in a weighted graph, with distances as edge weights.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs md:text-sm font-semibold text-primary">2</span>
          </div>
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-1">Optimal Path Calculation</h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              Dijkstra's algorithm finds the shortest path from your location to each compatible donor/bank.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs md:text-sm font-semibold text-primary">3</span>
          </div>
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-1">Priority Ranking</h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              Results are ranked by distance, availability status, and blood group compatibility for optimal allocation.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 md:p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-success-foreground">
            <span className="font-semibold">Time Complexity:</span> O((V + E) log V) where V = vertices (locations) and E = edges (connections)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanation;