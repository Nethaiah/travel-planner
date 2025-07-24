import { getTripById } from "@/app/server/tripActions";
import { TripPage } from "@/components/trip-view";
import { Navbar } from "@/components/navbar";

interface TripViewProps {
  params: { id: string };
}

export type { TripViewProps };

export default async function TripView({ params }: TripViewProps) {
  const { id } = await params;
  const trip = await getTripById(id);
  return (
    <>
      <Navbar />
      <TripPage trip={trip} />
    </>
  );
}