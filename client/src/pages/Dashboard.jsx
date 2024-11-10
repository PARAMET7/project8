import { useContext } from 'react';
import {  UserContext } from '../../context/userContext';

export default function DashBoard(){
  const {user} = useContext(UserContext)
  return (
    <div>
      <h1>dashboard</h1>
      {!!user &&(<h1>Hi {user.name} !</h1>)}
    </div>
  )
}
