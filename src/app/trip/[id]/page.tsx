import { TripPage, type TripPageProps } from "@/components/trip-view";
import { Navbar } from "@/components/navbar";

export default function TripView({ params }: TripPageProps) {
  return (
    <>
      <Navbar />
      <TripPage params={params} />
    </>
  )
}