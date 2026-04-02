import React from 'react'
import { useUser } from '../../../context/UserContext';

function Dashboard() {

  const { user } = useUser();

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard