import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../firebase.config";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdPerson, MdCalendarToday } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";

function Doctor() {
  const { id } = useParams(); // Get doctor document ID from URL
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch the doctor's details from the 'doctors' collection by document ID
        const doctorDocRef = doc(FIRESTORE_DB, "doctors", id);
        const doctorSnapshot = await getDoc(doctorDocRef);

        if (doctorSnapshot.exists()) {
          const doctorData = doctorSnapshot.data();
          setDoctor(doctorData);

          // Fetch all documents from the 'docslot_users' collection
          const usersSnapshot = await getDocs(
            collection(FIRESTORE_DB, "docslot_users")
          );

          // Filter through each document's appointments array to find the ones for this doctor
          const filteredAppointments = [];

          usersSnapshot.docs.forEach((userDoc) => {
            const userData = userDoc.data();
            const appointmentsArray = userData.appointments || []; // Default to an empty array if appointments is undefined

            if (Array.isArray(appointmentsArray)) {
              const matchingAppointments = appointmentsArray.filter(
                (appointment) => appointment.selectedDoctor === doctorData.name
              );

              if (matchingAppointments.length > 0) {
                filteredAppointments.push({
                  id: userDoc.id,
                  appointments: matchingAppointments,
                });
              }
            }
          });

          setAppointments(filteredAppointments);
        } else {
          setError("Doctor not found.");
        }
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleApprove = async (appointmentName, docId) => {
    try {
      // Fetch the document with appointments
      const docRef = doc(FIRESTORE_DB, "docslot_users", docId);
      const docSnapshot = await getDoc(docRef);
      const docData = docSnapshot.data();

      if (docData) {
        // Update the approval status of the appointment
        const updatedAppointments = docData.appointments.map((app) =>
          app.name === appointmentName ? { ...app, approved: true } : app
        );

        // Update the document in Firestore
        await updateDoc(docRef, { appointments: updatedAppointments });
        // Update the state to reflect the change
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === docId
              ? {
                  ...appointment,
                  appointments: updatedAppointments,
                }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const handleDecline = async (appointmentName, docId) => {
    try {
      // Fetch the document with appointments
      const docRef = doc(FIRESTORE_DB, "docslot_users", docId);
      const docSnapshot = await getDoc(docRef);
      const docData = docSnapshot.data();

      if (docData) {
        // Update the decline status of the appointment
        const updatedAppointments = docData.appointments.map((app) =>
          app.name === appointmentName ? { ...app, approved: false } : app
        );

        // Update the document in Firestore
        await updateDoc(docRef, { appointments: updatedAppointments });
        // Update the state to reflect the change
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === docId
              ? {
                  ...appointment,
                  appointments: updatedAppointments,
                }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error("Error declining appointment:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color={"#0143BE"} loading={true} size={50} />
      </div>
    );
  if (error)
    return (
      <p className="text-center text-lg font-semibold text-red-500">{error}</p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">
        {doctor && doctor.name} Appointments
      </h1>
      {doctor && (
        <div className="flex  justify-between items-center mb-6 border-b border-gray-300 pb-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="rounded-full w-32 h-32 object-contain shadow-md"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-blue-800">
              {doctor.name}
            </h2>
            <p className="text-lg text-gray-600 flex items-center">
              <MdPerson className="mr-2" /> Specialty: {doctor.specialty}
            </p>
            <p className="text-lg text-gray-600 flex items-center">
              <HiOutlineDocumentText className="mr-2" /> Category:{" "}
              {doctor.category}
            </p>
            <p className="text-lg text-gray-600 flex items-center">
              <MdCalendarToday className="mr-2" /> Experience:{" "}
              {doctor.experience} years
            </p>
          </div>
          <div>
            <button
              className="bg-red-700 text-white font-bold p-2 rounded-lg"
              onClick={() => navigate("/")}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {appointments.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-500">
          No appointments found for this doctor.
        </p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            {appointment.appointments.map((app, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg shadow-sm mb-4 flex flex-col"
              >
                <p className="flex items-center mb-2">
                  <strong className="text-gray-700 mr-2">Patient:</strong>{" "}
                  {app.name}
                </p>
                <p className="flex items-center mb-2">
                  <strong className="text-gray-700 mr-2">Date:</strong>{" "}
                  {app.date}
                </p>
                <p className="flex items-center mb-2">
                  <strong className="text-gray-700 mr-2">Status:</strong>{" "}
                  {app.approved ? (
                    <span className="text-green-600 flex items-center">
                      <FaCheckCircle className="mr-1" /> Approved
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <FaTimesCircle className="mr-1" /> Pending
                    </span>
                  )}
                </p>
                <div className="mt-4 flex justify-end gap-4">
                  {!app.approved && (
                    <>
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
                        onClick={() => handleApprove(app.name, appointment.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
                        onClick={() => handleDecline(app.name, appointment.id)}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Doctor;
