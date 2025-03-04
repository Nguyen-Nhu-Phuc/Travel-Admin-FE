import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import hotelApi from '../../api/hotelApi'

const HotelManagement = () => {
  const [hotels, setHotels] = useState([])
  const [open, setOpen] = useState(false)
  const [hotelData, setHotelData] = useState({ name: '', location: '' })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    const data = await hotelApi.getAll()
    setHotels(data)
  }

  const handleOpen = (hotel = null) => {
    if (hotel) {
      setHotelData(hotel)
      setEditId(hotel.id)
    } else {
      setHotelData({ name: '', location: '' })
      setEditId(null)
    }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (editId) {
      await hotelApi.update(editId, hotelData)
    } else {
      await hotelApi.create(hotelData)
    }
    fetchHotels()
    handleClose()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      await hotelApi.deleteHotel(id)
      fetchHotels()
    }
  }

  return (
    <div>
      <h2>Quản lý khách sạn</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm khách sạn
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Địa điểm</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(hotel)}>
                    Sửa
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(hotel.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên" name="name" value={hotelData.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField
            label="Địa điểm"
            name="location"
            value={hotelData.location}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default HotelManagement
