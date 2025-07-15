import { getTripById } from "@/app/server/tripActions";
import { TripPage } from "@/components/trip-view";
import { Navbar } from "@/components/navbar";
import type { Metadata, ResolvingMetadata } from "next";

interface TripViewProps {
  params: { id: string };
}

export default async function TripView(props: TripViewProps) {
  const { params } = props;
  const trip = await getTripById(params.id);
  return (
    <>
      <Navbar />
      <TripPage trip={trip} />
    </>
  );
}