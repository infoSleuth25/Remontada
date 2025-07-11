import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Skeleton } from '@mui/material';
import { dashboardData } from '../../constants/sampleData';
import {transformImage} from '../../lib/features';
import { useAdminAllUsersQuery } from '../../redux/api/api';

const columns = [
  {
  field : "id",
  headerName : "ID",
  headerClassName : "table-header",
  width : 200
  },
  {
  field : "avatar",
  headerName : "Avatar",
  headerClassName : "table-header",
  width : 150,
  renderCell : (params)=><Avatar alt={params.row.name} src={params.row.avatar} />
  },
  {
  field : "name",
  headerName : "Name",
  headerClassName : "table-header",
  width : 200,
  },
  {
  field : "username",
  headerName : "Username",
  headerClassName : "table-header",
  width : 200,
  },
  {
  field : "friends",
  headerName : "Friends",
  headerClassName : "table-header",
  width : 150,
  },
  {
  field : "groups",
  headerName : "Groups",
  headerClassName : "table-header",
  width : 150,
  },
];

const UserManagement = () => {
  const [rows,setRows] = useState([])
  const {data,isLoading} = useAdminAllUsersQuery();
  console.log(data);
  useEffect(()=>{
    if(data){
      setRows(data.users.map((i)=>({...i,id:i._id, avatar:transformImage(i.avatar,50)})));
    }
  },[data])
  return (
    <AdminLayout>
        {
          isLoading ? <Skeleton /> : <Table heading={"All users"} columns={columns} rows={rows} />
        }
    </AdminLayout>
  )
}

export default UserManagement