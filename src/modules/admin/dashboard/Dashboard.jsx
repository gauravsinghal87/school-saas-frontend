import React from 'react'
import { useUser } from '../../../hooks/useUser';

function Dashboard() {

  const { user } = useUser();

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard