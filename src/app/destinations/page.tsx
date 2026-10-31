import { DestinationsExplorer } from "@/components/destinations-explorer";
import { getDestinations } from "@/lib/destinations";

const DestinationsPage = async () => {
  const destinations = await getDestinations();

  return <DestinationsExplorer destinations={destinations} />;
};

export default DestinationsPage;
