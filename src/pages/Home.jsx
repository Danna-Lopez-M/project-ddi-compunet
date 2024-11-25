import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import { MdPets, MdLocalHospital } from "react-icons/md";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function HomePage() {
  return (
    <DefaultLayout>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src={homeImage}
            alt="Home Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-20">
          <MdPets className="w-16 h-16 text-white mb-6 animate-bounce" />

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Clínica Veterinaria Huellas de Amor
          </h1>

          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
            Donde el amor por tus mascotas se combina con la mejor atención
            veterinaria. Tu familia peluda merece lo mejor, y aquí estamos para
            cuidarla.
          </p>

          <div className="space-x-4">
            <Button
              as={Link}
              to="/appointment"
              className="w-full bg-primary-dark text-white hover:bg-primary font-semibold"
              variant="shadow"
              size="lg"
              radius="full"
              startContent={<MdLocalHospital className="text-xl" />}
            >
              Ver Citas
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default HomePage;
