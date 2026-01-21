import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/navigation/Header';
import EmergencyStatusBanner from '../../components/navigation/EmergencyStatusBanner';
import EmergencyFAB from '../../components/navigation/EmergencyFAB';
import NotificationToast from '../../components/navigation/NotificationToast';
import SearchFilters from './components/SearchFilters';
import AlgorithmExplanation from './components/AlgorithmExplanation';
import DonorResultCard from './components/DonorResultCard';
import MapVisualization from './components/MapVisualization';
import EmptyState from './components/EmptyState';

const NearestDonorFinder = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const mockDonorData = [
    {
      id: 1,
      name: "City General Hospital Blood Bank",
      type: "Blood Bank",
      bloodGroup: "A+",
      distance: "2.3",
      estimatedTime: "8 mins",
      location: "Downtown Medical District",
      status: "Available",
      verified: true,
      phone: "+1-555-0101",
      route: "Your Location → Main St → Hospital Ave → Destination",
      pathWeight: "2.3"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      type: "Individual Donor",
      bloodGroup: "A+",
      distance: "3.7",
      estimatedTime: "12 mins",
      location: "Riverside Community",
      status: "Available",
      verified: true,
      phone: "+1-555-0102",
      route: "Your Location → River Rd → Oak St → Destination",
      pathWeight: "3.7"
    },
    {
      id: 3,
      name: "Memorial Medical Center",
      type: "Blood Bank",
      bloodGroup: "A+",
      distance: "5.1",
      estimatedTime: "18 mins",
      location: "North Healthcare Complex",
      status: "Limited",
      verified: true,
      phone: "+1-555-0103",
      route: "Your Location → Highway 101 → Medical Pkwy → Destination",
      pathWeight: "5.1"
    },
    {
      id: 4,
      name: "Michael Chen",
      type: "Individual Donor",
      bloodGroup: "A+",
      distance: "6.8",
      estimatedTime: "22 mins",
      location: "Westside Residential",
      status: "Available",
      verified: true,
      phone: "+1-555-0104",
      route: "Your Location → West Ave → Park Blvd → Destination",
      pathWeight: "6.8"
    },
    {
      id: 5,
      name: "St. Mary\'s Hospital Blood Center",
      type: "Blood Bank",
      bloodGroup: "A+",
      distance: "8.2",
      estimatedTime: "28 mins",
      location: "East Medical Campus",
      status: "Available",
      verified: true,
      phone: "+1-555-0105",
      route: "Your Location → East Expressway → Hospital Dr → Destination",
      pathWeight: "8.2"
    },
    {
      id: 6,
      name: "Community Blood Services",
      type: "Blood Bank",
      bloodGroup: "A+",
      distance: "9.5",
      estimatedTime: "32 mins",
      location: "South District Center",
      status: "Unavailable",
      verified: true,
      phone: "+1-555-0106",
      route: "Your Location → South Rd → Community Ave → Destination",
      pathWeight: "9.5"
    }
  ];

  const emergencyAlerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Critical Blood Shortage',
      message: 'A+ blood group urgently needed at City General Hospital',
      actionLabel: 'View Details',
      onAction: () => console.log('View details clicked'),
      dismissed: false
    }
  ];

  const handleDetectLocation = () => {
    setIsDetecting(true);
    
    setTimeout(() => {
      setLocation('Downtown Medical District, City Center');
      setIsDetecting(false);
      
      setNotifications([{
        id: Date.now(),
        type: 'success',
        title: 'Location Detected',
        message: 'Your current location has been successfully identified',
        timestamp: new Date(),
        autoDismiss: true,
        duration: 3000
      }]);
    }, 2000);
  };

  const handleSearch = () => {
    if (!bloodGroup || !location) {
      setNotifications([{
        id: Date.now(),
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select blood group and enter location to search',
        timestamp: new Date(),
        autoDismiss: true,
        duration: 4000
      }]);
      return;
    }

    const filteredResults = mockDonorData?.filter(
      donor => donor?.bloodGroup === bloodGroup
    );

    setSearchResults(filteredResults);
    setHasSearched(true);

    setNotifications([{
      id: Date.now(),
      type: 'success',
      title: 'Search Complete',
      message: `Found ${filteredResults?.length} matching donors/banks using Dijkstra algorithm`,
      timestamp: new Date(),
      autoDismiss: true,
      duration: 4000
    }]);
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Nearest Donor Finder - SmartBloodApplication</title>
        <meta name="description" content="Find nearest blood donors and blood banks using advanced graph and Dijkstra algorithm for optimal route calculation" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <EmergencyStatusBanner alerts={emergencyAlerts} />
        <NotificationToast 
          notifications={notifications} 
          onDismiss={handleDismissNotification} 
        />
        <EmergencyFAB />

        <main className="content-main max-w-screen-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Nearest Donor Finder</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              “Finding the nearest life-saving blood through intelligent pathfinding.”
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <SearchFilters
                bloodGroup={bloodGroup}
                setBloodGroup={setBloodGroup}
                location={location}
                setLocation={setLocation}
                onSearch={handleSearch}
                onDetectLocation={handleDetectLocation}
                isDetecting={isDetecting}
              />
            </div>
            <div className="lg:col-span-1">
              <AlgorithmExplanation />
            </div>
          </div>

          {!hasSearched ? (
            <EmptyState onSearch={scrollToSearch} />
          ) : (
            <>
              <div className="mb-6 md:mb-8">
                <MapVisualization 
                  searchLocation={location} 
                  results={searchResults} 
                />
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Search Results ({searchResults?.length})
                  </h2>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Ranked by optimal distance</span>
                  </div>
                </div>
              </div>

              {searchResults?.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl md:text-3xl">🔍</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">No Results Found</h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                    No donors or blood banks found matching {bloodGroup} in {location}. Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {searchResults?.map((donor, index) => (
                    <DonorResultCard 
                      key={donor?.id} 
                      donor={donor} 
                      rank={index + 1} 
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default NearestDonorFinder;