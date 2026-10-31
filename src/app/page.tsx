import { Banner } from "@/components/banner";
import { WhyChoose } from "@/components/why-choose";
import { Testimonials } from "@/components/testimonials";
import { CallToAction } from "@/components/call-to-action";

export default function Home() {
  return (
    <>
      <Banner />
      <WhyChoose />
      <Testimonials />
      <CallToAction />
    </>
  );
}
