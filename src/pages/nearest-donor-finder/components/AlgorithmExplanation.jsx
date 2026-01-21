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
            {/* Our system uses <span className="font-semibold text-foreground">Graph Theory</span> combined with <span className="font-semibold text-foreground">Dijkstra's Algorithm</span> to calculate the shortest path between your location and available donors/blood banks. */}
            <span className="font-semibold text-foreground">SmartBloodApplication</span> uses an intelligent decision-making process to identify the most suitable blood donors and blood banks based on location, availability, and urgency, ensuring fast and reliable blood allocation during emergencies.
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
              All donors and blood banks are digitally represented within the system, where locations are connected based on real-world distances. This structure allows the application to efficiently analyze proximity between the requester and available blood sources.
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
              The system evaluates multiple possible routes from the requester’s location and determines the most efficient path to reach each compatible donor or blood bank, reducing response time in critical situations.
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
              Identified blood sources are ranked according to:
Distance from the requester,
Current blood availability,
Blood group compatibility
This ranking ensures that the closest and most suitable blood source is selected first.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="mt-4 p-3 md:p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-success-foreground">
            <span className="font-semibold">Time Complexity:</span> O((V + E) log V) where V = vertices (locations) and E = edges (connections)
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default AlgorithmExplanation;