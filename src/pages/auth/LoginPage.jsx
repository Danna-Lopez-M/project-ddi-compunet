import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/button";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput";
import { useAuth } from "../../context/AuthContext";
import loginImage from "../../assets/login.png";
import Alert from "../../components/Alert";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const [visibleErrors, setVisibleErrors] = useState([]);
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setVisibleErrors(loginErrors);
  }, [loginErrors]);

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen">
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#FBE7EC] to-white">
          <div className="w-full max-w-md p-8">
            <h1 className="text-4xl font-bold text-primary-dark mb-4">
              Huellas de amor
            </h1>
            <p className="mb-8 text-gray-600">
              Bienvenido a Huellas de amor, por favor inicie sesión en su cuenta
            </p>

            {visibleErrors.map((error, i) => (
              <Alert
                key={i}
                type={true}
                title="Error iniciando sesión"
                message={error}
                onClose={() => handleCloseAlert(i)}
              />
            ))}

            <form onSubmit={onSubmit} className="space-y-10">
              <CustomInput
                type="email"
                label="Email"
                placeholder="Ingrese su email"
                name="email"
                register={register("email", {
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                errors={errors}
                errorMessage={errors.email?.message || "El email es requerido"}
              />

              <CustomInput
                type="password"
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                name="password"
                register={register("password", { required: true })}
                errors={errors}
                errorMessage="La contraseña es requerida"
              />

              <Button
                type="submit"
                className="w-full bg-primary-dark text-white hover:bg-primary"
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary-dark"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-gray-200 items-center justify-center">
          <div className="w-4/5">
            <img
              src={loginImage}
              alt="Login Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
