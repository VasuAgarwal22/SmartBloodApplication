import React from 'react';
import { Helmet } from 'react-helmet';

const AppImpactStatistics = ({ stats }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const impactMetrics = [
    {
      title: 'Lives Saved',
      value: formatNumber(stats.livesSaved),
      icon: 'Heart',
      description: 'People who received timely blood transfusions',
      color: 'text-red-600'
    },
    {
      title: 'Blood Units Distributed',
      value: formatNumber(stats.bloodUnitsDistributed),
      icon: 'Droplet',
      description: 'Units of blood successfully allocated',
      color: 'text-blue-600'
    },
    {
      title: 'Active Donors',
      value: formatNumber(stats.activeDonors),
      icon: 'Users',
      description: 'Active blood donors in our network',
      color: 'text-green-600'
    },
    {
      title: 'Hospitals Served',
      value: formatNumber(stats.hospitalsServed),
      icon: 'Building',
      description: 'Medical facilities connected to our platform',
      color: 'text-purple-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>App Impact Statistics - SmartBloodApplication</title>
      </Helmet>

      <div className="mb-8 md:mb-12">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Our Impact So Far
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Together, we're making a real difference in emergency healthcare through our intelligent blood allocation system.
          </p>
        </div>

        {/* Main Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 mb-4 ${metric.color}`}>
                <span className="text-2xl md:text-3xl">{metric.icon === 'Users' ? '👥' : metric.icon === 'CheckCircle' ? '✅' : metric.icon === 'Building2' ? '🏥' : '❤️'}</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-2">{metric.value}</div>
              <div className="text-sm md:text-base font-semibold mb-2">{metric.title}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{metric.description}</div>
            </div>
          ))}
        </div>



        {/* Call to Action */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl border border-primary/20 p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-3">
              Join Our Mission to Save Lives
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-2xl mx-auto">
              Every donor counts. Every request matters. Together, we're building a safer healthcare ecosystem for our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/nearest-donor-finder'}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Become a Donor
              </button>
              <button
                onClick={() => window.location.href = '/request-blood'}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                Request Blood
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppImpactStatistics;
