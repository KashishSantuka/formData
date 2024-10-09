import { useState, useEffect } from "react";

const DetailsPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pincode: "",
    state: "",
    country: "",
    city: "",
  });

  const [pinCode, setPinCode] = useState("");

  const [submittedData, setSubmittedData] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);

  // const [isEditMode, setIsEditMode] = useState(false);

  // const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async (pinCode) => {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pinCode}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Not found`);
        }

        const data = await response.json();

        if (data && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const { State, District, Country } = data[0].PostOffice[0];
          setFormData({
            ...formData,
            state: State,
            city: District,
            country: Country,
          });
          console.log(
            "State:",
            State,
            "District:",
            District,
            "Country:",
            Country
          );
        }
        console.log(data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    if (pinCode && pinCode.length === 6) {
      fetchUserData(pinCode);
    }
  }, [pinCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePincode = (e) => {
    setPinCode(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let editIndex = null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const renderData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      pincode: e.target.pincode.value,
      state: e.target.state.value,
      country: e.target.country.value,
      city: e.target.city.value,
    };

    if (editIndex !== null) {
      submittedData[editIndex] = renderData;
      editIndex = null; 
    } else {
      setSubmittedData((prevData) => [...prevData, renderData]);
      setIsSubmit(true);
    }

    setFormData({
      firstName: "",
      lastName: "",
      pincode: null,
      state: "",
      country: "",
      city: "",
    });
  };

  const handleEdit = (index) => {
    const editedData = submittedData[index];

    setFormData({
      firstName: editedData.firstName,
      lastName: editedData.lastName,
      pincode: editedData.pincode,
      state: editedData.state,
      country: editedData.country,
      city: editedData.city,
    });
        
    editIndex = index;
  };

  return (
    <div>
      <h1>User Information Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="pincode">Pincode:</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={pinCode}
            onChange={handlePincode}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      {isSubmit && submittedData && (
        <div>
          <h2>Submitted Data</h2>
          {submittedData.map((data, index) => (
            <p key={index}>
              First Name: {data.firstName}, Last Name: {data.lastName}, Pincode:{" "}
              {data.pincode}, State: {data.state}, Country: {data.country},
              City: {data.city}
              <button onClick={() => handleEdit(index)}>Edit</button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
