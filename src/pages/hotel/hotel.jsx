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
  TextField,
  IconButton
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { IconEye } from '@tabler/icons-react'
import hotelApi from '../../api/hotelApi'
import { getAllDestinations } from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

const HotelManagement = () => {
  const [hotels, setHotels] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    price: '',
    rating: '',
    image: [],
    destination: null
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  useEffect(() => {
    fetchHotels()
    fetchDestinations()
  }, [])

  const fetchHotels = async () => {
    try {
      const data = await hotelApi.getAll()
      setHotels(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách sạn:', error)
    }
  }

  const fetchDestinations = async () => {
    try {
      const data = await getAllDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const handleOpen = (hotel = null) => {
    if (hotel) {
      setHotelData({ ...hotel, destination: hotel.destination || null })
      setPreviewImages(hotel.image ? hotel.image.map((img) => img.url) : [])
      setEditId(hotel._id)
    } else {
      setHotelData({ name: '', address: '', price: '', rating: '', image: [], destination: null })
      setPreviewImages([])
      setEditId(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setPreviewImages([])
    setEditId(null)
  }

  const handleChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setHotelData({ ...hotelData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      const jsonData = {
        name: hotelData.name,
        address: hotelData.address,
        price: hotelData.price,
        rating: +hotelData.rating,
        destination_id: hotelData.destination ? hotelData.destination._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (hotelData.image.length > 0) {
        hotelData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await hotelApi.update(editId, jsonData)
      } else {
        await hotelApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      setCheck(false)
      toast.success('Tạo khách sạn thành công!')
      setHotelData({ name: '', address: '', price: '', rating: '', image: [], destination: null })

      await fetchHotels()
      handleClose()
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu khách sạn:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await hotelApi.deleteHotel(id)
        fetchHotels()
      } catch (error) {
        console.error('Lỗi khi xóa khách sạn:', error)
      }
    }
  }

  const handleOpenImageDialog = (images) => {
    setSelectedImages(images)
    setImageDialogOpen(true)
  }

  return (
    <div>
      <h2>Danh Sách khách sạn</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm khách sạn
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>{hotel.price}</TableCell>
                <TableCell>{hotel.rating}</TableCell>
                <TableCell>
                  {hotel.image && hotel.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(hotel.image.map((img) => img.url))}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(hotel)}>
                    Sửa
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(hotel._id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <div>
          <Backdrop
            sx={(theme) => ({ color: '#199c51', zIndex: 999999 })}
            open={check}

            // onClick={!check}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        <DialogTitle>{editId ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên" name="name" value={hotelData.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField
            label="Địa chỉ"
            name="address"
            value={hotelData.address}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Giá"
            name="price"
            value={hotelData.price}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Đánh giá"
            name="rating"
            value={hotelData.rating}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          <Autocomplete
            options={destinations}
            getOptionLabel={(option) => option.name}
            value={hotelData.destination}
            onChange={(event, newValue) => setHotelData({ ...hotelData, destination: newValue })}
            renderInput={(params, index) => (
              <TextField key={index} {...params} label="Chọn địa điểm" margin="dense" fullWidth />
            )}
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
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Hình ảnh khách sạn</DialogTitle>
        <DialogContent>
          {selectedImages.map((img, index) => (
            <img key={index} src={img} alt="hotel" style={{ width: '100%', marginBottom: 10, borderRadius: 5 }} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </div>
  )
}
export default HotelManagement
