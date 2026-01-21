import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustBadges = () => {
  const badges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'HIPAA Compliant',
      description: 'Healthcare data protection certified'
    },
    {
      id: 2,
      icon: 'Award',
      title: 'ISO 27001',
      description: 'Information security management'
    },
    {
      id: 3,
      icon: 'CheckCircle',
      title: 'FDA Registered',
      description: 'Medical device registration'
    },
    {
      id: 4,
      icon: 'Lock',
      title: 'SOC 2 Type II',
      description: 'Security & availability controls'
    }
  ];

  // return (
  //   <div className="bg-card rounded-xl border-2 border-border p-4 md:p-6">
  //     <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6"></h3>
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  //       {badges?.map((badge) => (
  //         <div key={badge?.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-250">
  //           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
  //             <Icon name={badge?.icon} size={20} color="var(--color-primary)" />
  //           </div>
  //           <div className="flex-1 min-w-0">
  //             <p className="text-sm font-semibold mb-0.5">{badge?.title}</p>
  //             <p className="text-xs text-muted-foreground caption">{badge?.description}</p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default TrustBadges;