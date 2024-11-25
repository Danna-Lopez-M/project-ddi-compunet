import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes";
import LoginPage from "./pages/auth/LoginPage";
import Home from "./pages/Home";
import User from "./pages/user/UserPage";
import Role from "./pages/role/RolesPage";
import AdminCv from "./pages/cvs/CvPage";
import Treatment from "./pages/treatment/TreatmentPage";
import PetPage from "./pages/pet/PetPage";
import PermissionPage from "./pages/per/PermissionPage";
import Appointment from "./pages/appointment/AppointmentPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MedicalHistory from "./pages/medicalHistory/MedicalHistoryPage";

// Importaciones de Providers
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import { CvProvider } from "./context/CvContext";
import { TreatmentProvider } from "./context/TreatmentContext";
import { PetProvider } from "./context/PetContext";
import { PermissionProvider } from "./context/PermissionContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { MedicalHistoryProvider } from "./context/MedicalHistoryContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <RoleProvider>
            <CvProvider>
              <TreatmentProvider>
                <PetProvider>
                  <PermissionProvider>
                    <AppointmentProvider>
                      <MedicalHistoryProvider>
                        <Routes>
                          {/* Rutas públicas */}
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route
                            path="/unauthorized"
                            element={<UnauthorizedPage />}
                          />

                          {/* Rutas protegidas para todos los usuarios autenticados */}
                          <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route
                              path="/appointment"
                              element={<Appointment />}
                            />
                            <Route
                              path="/medicalHistory"
                              element={<MedicalHistory />}
                            />
                          </Route>

                          {/* Rutas protegidas solo para administradores */}
                          <Route
                            element={
                              <ProtectedRoute allowedRoles={["ROLE_Admin"]} />
                            }
                          >
                            <Route path="/users" element={<User />} />
                            <Route path="/pets" element={<PetPage />} />
                            <Route
                              path="/permissions"
                              element={<PermissionPage />}
                            />
                            <Route path="/api/roles" element={<Role />} />
                            <Route path="/api/cvs" element={<AdminCv />} />
                          </Route>

                          {/* Rutas para admin y veterinarios */}
                          <Route
                            element={
                              <ProtectedRoute
                                allowedRoles={["ROLE_Admin", "ROLE_Veterinary"]}
                              />
                            }
                          >
                            <Route
                              path="/api/treatments"
                              element={<Treatment />}
                            />
                          </Route>
                        </Routes>
                      </MedicalHistoryProvider>
                    </AppointmentProvider>
                  </PermissionProvider>
                </PetProvider>
              </TreatmentProvider>
            </CvProvider>
          </RoleProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
