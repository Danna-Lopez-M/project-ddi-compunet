import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-600 mb-4">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <Link
          to="/home"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
