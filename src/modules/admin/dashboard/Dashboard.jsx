import React from 'react'
import { useUser } from '../../../context/UserContext';

function Dashboard() {

  const { user } = useUser();

  console.log("Current User in Dashboard:", user);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard