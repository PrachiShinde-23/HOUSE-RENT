
import axios from "axios";
import React, { useState, useEffect } from "react";
import Toast from "../common/Toast";
import API_BASE_URL from "../../config/apiConfig";

const AllPropertiesCards = ({ loggedIn }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/user/getAllProperties`,
        { withCredentials: true }
      );
      setAllProperties(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        { withCredentials: true }
      );

      if (res.data.success) {
        showToast("success", res.data.message);
        setShowModal(false);
        setUserDetails({ fullName: "", phone: "" });
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Booking failed");
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const filteredProperties = allProperties
    .filter(
      (property) =>
        filterPropertyAddress === "" ||
        property.propertyAddress
          .toLowerCase()
          .includes(filterPropertyAddress.toLowerCase())
    )
    .filter(
      (property) =>
        filterPropertyAdType === "" ||
        property.propertyAdType
          .toLowerCase()
          .includes(filterPropertyAdType.toLowerCase())
    )
    .filter(
      (property) =>
        filterPropertyType === "" ||
        property.propertyType
          .toLowerCase()
          .includes(filterPropertyType.toLowerCase())
    );

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  return (
    <div className="p-6 text-white">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search by Address"
          value={filterPropertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          className="bg-gray-800/70 border border-gray-700 p-2 rounded w-1/3 text-white"
        />
        <select
          value={filterPropertyAdType}
          onChange={(e) => setPropertyAdType(e.target.value)}
          className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white"
        >
          <option value="">All Ad Types</option>
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
        <select
          value={filterPropertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white"
        >
          <option value="">All Types</option>
          <option value="commercial">Commercial</option>
          <option value="land/plot">Land/Plot</option>
          <option value="residential">Residential</option>
        </select>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={
                  property.propertyImages?.[0]
                    ? `${API_BASE_URL}/uploads/${property.propertyImages[0]}`
                    : "https://via.placeholder.com/400"
                }
                alt="Property"
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {property.propertyAddress}
                </h3>

                <p className="text-gray-400 text-sm">
                  {property.propertyType} - {property.propertyAdType}
                </p>

                {loggedIn && (
                  <>
                    <p className="mt-2 text-sm">
                      <b>Owner:</b> {property.ownerContact}
                    </p>
                    <p className="text-sm">
                      <b>Availability:</b> {property.isAvailable}
                    </p>
                    <p className="text-sm">
                      <b>Price:</b> ₹{property.propertyAmt}
                    </p>
                  </>
                )}

                {property.isAvailable === "Available" && loggedIn ? (
                  <button
                    onClick={() => openModal(property)}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  >
                    Get Info / Book
                  </button>
                ) : (
                  <p className="mt-2 text-red-400 text-xs">
                    {property.isAvailable}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No properties available at the moment.</p>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4">Property Info</h3>

            <img
              src={
                selectedProperty.propertyImages?.[0]
                  ? `${API_BASE_URL}/uploads/${selectedProperty.propertyImages[0]}`
                  : "https://via.placeholder.com/400"
              }
              alt="Property"
              className="w-full h-48 object-cover rounded mb-4"
            />

            <p><b>Owner Contact:</b> {selectedProperty.ownerContact}</p>
            <p><b>Availability:</b> {selectedProperty.isAvailable}</p>
            <p><b>Price:</b> ₹{selectedProperty.propertyAmt}</p>
            <p><b>Location:</b> {selectedProperty.propertyAddress}</p>

            <form
              className="mt-4 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking(
                  "pending",
                  selectedProperty._id,
                  selectedProperty.ownerId
                );
              }}
            >
              <input
                type="text"
                placeholder="Your Full Name"
                required
                value={userDetails.fullName}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, fullName: e.target.value })
                }
                className="bg-gray-800 p-2 w-full rounded"
              />

              <input
                type="number"
                placeholder="Phone Number"
                required
                value={userDetails.phone}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, phone: e.target.value })
                }
                className="bg-gray-800 p-2 w-full rounded"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Book Property
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;