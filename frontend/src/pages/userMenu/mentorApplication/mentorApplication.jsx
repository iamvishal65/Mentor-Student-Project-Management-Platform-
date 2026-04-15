import React from 'react'

const mentorApplication = () => {
  const  applyForMentorRole=async()=>{
    try {
      const res = await axiosInstance.post("/api/auth/student/register", data);
    } catch (error) {
      
    }
  }
  return (
    <div>
      
    </div>
  )
}

export default mentorApplication
