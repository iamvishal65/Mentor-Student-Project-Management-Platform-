import React from 'react'
import { useState } from 'react';

const MentorRegisterForm = ({onSubmit,loading}) => {
  const [formData, setFormData] = useState({
     firstName: "",
     lastName: "",
     designation: "",
   });
 
   function handleChange(e) {
     const { name, value } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: value
     }));
   }
 
   function handleSubmit(e) {
     e.preventDefault();
     onSubmit(formData); 
   }
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
         <h2 className="text-2xl font-bold text-center mb-6">
           Mentor Registration
         </h2>
 
         <form onSubmit={handleSubmit} className="space-y-4">
 
           <div>
             <label className="block text-sm font-medium mb-1">
               First Name
             </label>
             <input
               type="text"
               name="firstName"
               value={formData.firstName}
               onChange={handleChange}
               className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               required
             />
           </div>
 
           <div>
             <label className="block text-sm font-medium mb-1">
               Last Name
             </label>
             <input
               type="text"
               name="lastName"
               value={formData.lastName}
               onChange={handleChange}
               className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               required
             />
           </div>
 
           
           <div>
             <label className="block text-sm font-medium mb-1">
               Designation
             </label>
             <input
               type="text"
               name="designation"
               value={formData.designation}
               onChange={handleChange}
               className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               required
             />
           </div>
 
           <button
             type="submit"
             disabled={loading}
             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
           >
            {loading ? "Registering..." : "Register as Mentor"}
             Register as Mentor
           </button>
 
         </form>
       </div>
     </div>
   );
 };

export default MentorRegisterForm
