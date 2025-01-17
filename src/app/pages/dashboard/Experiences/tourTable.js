import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Tourlist from "app/pages/Data/data"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import { TourAddAction } from "app/reducToolkit/editTour"

import CancelIcon from "@mui/icons-material/Close"
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid"

import { useDispatch } from "react-redux"
import axios from "axios"

const randomId = () => Math.floor(Math.random() * 10)

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = randomId()
  }

  return (
    <GridToolbarContainer>
      <Link to={"addTour"}>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Add Tour
        </Button>
      </Link>
    </GridToolbarContainer>
  )
}

export default function TourTable({ text }) {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  // console.log(status)
  useEffect(() => {
    axios
      .get("http://localhost:3000/tourList")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }, [])

  const initialRows = data
    .filter((tour) => {
      if (text.trim() === "") return true
      return tour.name.toLowerCase().includes(text.toLowerCase())
    })
    .map((tour, index) => ({
      id: tour.id,
      image: tour.imagejpeg,
      name: tour.name,
      duration: tour.duration,
      status: tour.status,
      price: tour.price,
      role: tour.alt,
      tag: tour.tag,
      tagline: tour.tagline,
    }))

  const [rows, setRows] = React.useState([])
  const [rowModesModel, setRowModesModel] = React.useState({})

  useEffect(() => {
    setRows(initialRows)
  }, [data, text])

  const columns = [
    {
      field: "id",
      headerName: "DBC ID",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
      filterable: true,
    },
    {
      field: "image",
      headerName: "Tour-Image",
      renderCell: (params) => (
        <img
          src={params.value}
          alt=''
          srcSet=''
          style={{ width: "90%", height: "auto", borderRadius: "10px" }}
        />
      ),
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      headerAlign: "center",
      filterable: true,
    },
    {
      field: "tourId",
      headerName: "Product Code",
      type: "number",
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: true,
      filterable: true,
    },
    {
      field: "name",
      headerName: "Title",
      width: 250,
      editable: true,
      align: "left",
      headerAlign: "left",
      filterable: true,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 250,
      editable: true,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      filterable: true,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: "primary.main",
              }}
              // onClick={handleSaveClick(id)}
            />,
          ]
        }

        return [
          <Link to={`/overview/touredit/${id}`}>
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              className='textPrimary'
              onClick={() => dispatch(TourAddAction.tourAdd(false))}
              color='inherit'
            />
          </Link>,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            // onClick={handleDeleteClick(id)}
            color='inherit'
          />,
        ]
      },
    },
  ]

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        // onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        // processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  )
}
