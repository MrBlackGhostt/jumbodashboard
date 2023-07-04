import * as React from "react"
import { Link } from "react-router-dom"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"

import CancelIcon from "@mui/icons-material/Close"
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid"

const roles = ["Market", "Finance", "Development"]
const randomRole = () => {
  return roles[Math.floor(Math.random() * roles.length)]
}

const generateRandomDate = () => {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

const ID = () => Math.floor(Math.random() * 10)

const initialRows = [
  {
    id: ID(),
    image: "",
    name: "Tour1",
    tourId: 25,
    status: true,
    joinDate: generateRandomDate(),
    role: randomRole(),
  },
  {
    id: ID(),
    image: "",
    name: "Tour2",
    tourId: 25,
    status: true,
    joinDate: generateRandomDate(),
    role: randomRole(),
  },
  {
    id: ID(),
    image: "",
    name: "Tour3",
    tourId: 25,
    status: true,
    joinDate: generateRandomDate(),
    role: randomRole(),
  },
  {
    id: ID(),
    image: "",
    name: "Tour4",
    tourId: 25,
    status: true,
    joinDate: generateRandomDate(),
    role: randomRole(),
  },
  {
    id: ID(),
    image: "",
    name: "Tour5",
    tourId: 25,
    status: true,
    joinDate: generateRandomDate(),
    role: randomRole(),
  },
]
const randomId = () => Math.floor(Math.random() * 10)

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = randomId()
    // setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }])
    // setRowModesModel((oldModel) => ({
    //   ...oldModel,
    //   [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    // }))
  }

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

export default function TourTable() {
  const [rows, setRows] = React.useState(initialRows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  // const handleSaveClick = (id) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  // }

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  // const handleCancelClick = (id) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   })

  //   const editedRow = rows.find((row) => row.id === id)
  //   if (editedRow.isNew) {
  //     setRows(rows.filter((row) => row.id !== id))
  //   }
  // }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    {
      field: "id",
      headerName: "DBC ID",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    { field: "image", headerName: "Tour-Image", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tourId",
      headerName: "Product Code",
      type: "number",
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "name",
      headerName: "Title",
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
            // <GridActionsCellItem
            //   icon={<CancelIcon />}
            //   label='Cancel'
            //   className='textPrimary'
            //   onClick={handleCancelClick(id)}
            //   color='inherit'
            // />,
          ]
        }

        return [
          <Link to='touredit'>
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              className='textPrimary'
              // onClick={handleEditClick(id)}
              color='inherit'
            />
          </Link>,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
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
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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