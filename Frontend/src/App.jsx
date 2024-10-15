import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./index.css";

const TeamSubmissionForm = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    teamLeadName: "",
    phone: "",
    email: "",
    collegeName: "",
    year: "",
    department: "",
    teamSize: "0",
    teamMembers: [],
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setFormData({
      ...formData,
      teamSize: size.toString(),
      teamMembers: Array(size).fill({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
      }),
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!formData.teamLeadName.trim())
      newErrors.teamLeadName = "Team lead name is required";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.collegeName.trim())
      newErrors.collegeName = "College name is required";
    if (!formData.year) newErrors.year = "Please select your year of study";
    if (!formData.department.trim())
      newErrors.department = "Department is required";

    formData.teamMembers.forEach((member, index) => {
      if (!member.name.trim())
        newErrors[`memberName${index}`] = `Team member ${
          index + 1
        } name is required`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email))
        newErrors[
          `memberEmail${index}`
        ] = `Please enter a valid email for team member ${index + 1}`;
      if (!/^\d{10}$/.test(member.phone))
        newErrors[
          `memberPhone${index}`
        ] = `Please enter a valid 10-digit phone number for team member ${
          index + 1
        }`;
      if (!member.department.trim())
        newErrors[
          `memberDepartment${index}`
        ] = `Department is required for team member ${index + 1}`;
      if (!member.year)
        newErrors[`memberYear${index}`] = `Please select year for team member ${
          index + 1
        }`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "https://forms-backend-api.vercel.app/submit-team",
          formData
        );
        if (response.status === 200) {
          Swal.fire("Success", "Form submitted successfully!", "success");
          // Reset form
          setFormData({
            teamName: "",
            teamLeadName: "",
            phone: "",
            email: "",
            collegeName: "",
            year: "",
            department: "",
            teamSize: "0",
            teamMembers: [],
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "There was a problem submitting the form.", "error");
      }
    }
  };

  return (
    <div className='content'>
      <div className='container'>
        <h1>Team Event Submission</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor='teamName'>Team Name:</label>
          <input
            type='text'
            id='teamName'
            name='teamName'
            value={formData.teamName}
            onChange={handleInputChange}
            placeholder='Enter your team name'
          />
          {errors.teamName && (
            <div className='error-message'>{errors.teamName}</div>
          )}

          <label htmlFor='teamLeadName'>Team Lead Name:</label>
          <input
            type='text'
            id='teamLeadName'
            name='teamLeadName'
            value={formData.teamLeadName}
            onChange={handleInputChange}
            placeholder='Enter team lead name'
          />
          {errors.teamLeadName && (
            <div className='error-message'>{errors.teamLeadName}</div>
          )}

          <label htmlFor='phone'>Phone:</label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleInputChange}
            placeholder='Enter your phone number'
          />
          {errors.phone && <div className='error-message'>{errors.phone}</div>}

          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Enter your email address'
          />
          {errors.email && <div className='error-message'>{errors.email}</div>}

          <label htmlFor='collegeName'>College Name:</label>
          <input
            type='text'
            id='collegeName'
            name='collegeName'
            value={formData.collegeName}
            onChange={handleInputChange}
            placeholder='Enter your college name'
          />
          {errors.collegeName && (
            <div className='error-message'>{errors.collegeName}</div>
          )}

          <label htmlFor='year'>Year of Study:</label>
          <select
            id='year'
            name='year'
            value={formData.year}
            onChange={handleInputChange}
          >
            <option value=''>Select your year</option>
            <option value='1st Year'>1st Year</option>
            <option value='2nd Year'>2nd Year</option>
            <option value='3rd Year'>3rd Year</option>
            <option value='4th Year'>4th Year</option>
            <option value='5th Year'>5th Year</option>
          </select>
          {errors.year && <div className='error-message'>{errors.year}</div>}

          <label htmlFor='department'>Department:</label>
          <input
            type='text'
            id='department'
            name='department'
            value={formData.department}
            onChange={handleInputChange}
            placeholder='Enter your department'
          />
          {errors.department && (
            <div className='error-message'>{errors.department}</div>
          )}

          <label htmlFor='teamSize'>Team Members:</label>
          <select
            id='teamSize'
            name='teamSize'
            value={formData.teamSize}
            onChange={handleTeamSizeChange}
          >
            <option value='0'>Select</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
          </select>

          {formData.teamMembers.map((member, index) => (
            <fieldset key={index}>
              <legend>Team Member {index + 1}</legend>
              <label htmlFor={`memberName${index}`}>Name:</label>
              <input
                type='text'
                id={`memberName${index}`}
                value={member.name}
                onChange={(e) =>
                  handleTeamMemberChange(index, "name", e.target.value)
                }
                placeholder={`Enter teammate ${index + 1} name`}
              />
              {errors[`memberName${index}`] && (
                <div className='error-message'>
                  {errors[`memberName${index}`]}
                </div>
              )}

              <label htmlFor={`memberEmail${index}`}>Email:</label>
              <input
                type='email'
                id={`memberEmail${index}`}
                value={member.email}
                onChange={(e) =>
                  handleTeamMemberChange(index, "email", e.target.value)
                }
                placeholder={`Enter teammate ${index + 1} email`}
              />
              {errors[`memberEmail${index}`] && (
                <div className='error-message'>
                  {errors[`memberEmail${index}`]}
                </div>
              )}

              <label htmlFor={`memberPhone${index}`}>Phone:</label>
              <input
                type='tel'
                id={`memberPhone${index}`}
                value={member.phone}
                onChange={(e) =>
                  handleTeamMemberChange(index, "phone", e.target.value)
                }
                placeholder={`Enter teammate ${index + 1} phone number`}
              />
              {errors[`memberPhone${index}`] && (
                <div className='error-message'>
                  {errors[`memberPhone${index}`]}
                </div>
              )}

              <label htmlFor={`memberDepartment${index}`}>Department:</label>
              <input
                type='text'
                id={`memberDepartment${index}`}
                value={member.department}
                onChange={(e) =>
                  handleTeamMemberChange(index, "department", e.target.value)
                }
                placeholder={`Enter teammate ${index + 1} department`}
              />
              {errors[`memberDepartment${index}`] && (
                <div className='error-message'>
                  {errors[`memberDepartment${index}`]}
                </div>
              )}

              <label htmlFor={`memberYear${index}`}>Year:</label>
              <select
                id={`memberYear${index}`}
                value={member.year}
                onChange={(e) =>
                  handleTeamMemberChange(index, "year", e.target.value)
                }
              >
                <option value=''>Select year</option>
                <option value='1st Year'>1st Year</option>
                <option value='2nd Year'>2nd Year</option>
                <option value='3rd Year'>3rd Year</option>
                <option value='4th Year'>4th Year</option>
                <option value='5th Year'>5th Year</option>
              </select>
              {errors[`memberYear${index}`] && (
                <div className='error-message'>
                  {errors[`memberYear${index}`]}
                </div>
              )}
            </fieldset>
          ))}

          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TeamSubmissionForm;
