import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useTreatments } from "../../context/TreatmentContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ViewTreatmentsModal = ({ isOpen, onClose, appointment }) => {
  const { treatments, fetchTreatments } = useTreatments();
  const [appointmentTreatments, setAppointmentTreatments] = useState([]);

  useEffect(() => {
    if (isOpen && appointment) {
      fetchTreatments();
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (appointment && treatments) {
      const filteredTreatments = treatments.filter(
        (treatment) =>
          treatment.appoinmentIdAppointment === appointment.idAppointment,
      );
      setAppointmentTreatments(filteredTreatments);
    }
  }, [treatments, appointment]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Tratamientos de la Cita {appointment?.idAppointment}
            </ModalHeader>
            <ModalBody>
              {appointmentTreatments.length === 0 ? (
                <div className="text-center py-4">
                  No hay tratamientos registrados para esta cita.
                </div>
              ) : (
                <Table aria-label="Tabla de tratamientos">
                  <TableHeader>
                    <TableColumn>DESCRIPCIÓN</TableColumn>
                    <TableColumn>DOSIS</TableColumn>
                    <TableColumn>FRECUENCIA</TableColumn>
                    <TableColumn>INICIO</TableColumn>
                    <TableColumn>FIN</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {appointmentTreatments.map((treatment) => (
                      <TableRow key={treatment.idTrataments}>
                        <TableCell>
                          <div className="max-w-xs">
                            {treatment.descriptiont}
                          </div>
                        </TableCell>
                        <TableCell>{treatment.dosage}</TableCell>
                        <TableCell>{treatment.frequency}</TableCell>
                        <TableCell>{formatDate(treatment.dateStart)}</TableCell>
                        <TableCell>
                          {formatDate(treatment.dateFinish)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary-dark text-white hover:bg-primary"
                onPress={onClose}
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewTreatmentsModal;
